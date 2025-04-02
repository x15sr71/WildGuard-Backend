"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageResponse = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const ImageInfo_1 = require("../LLM/ImageInfo");
const ImageInfoSummary_1 = require("../LLM/ImageInfoSummary");
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const fetchOrgInfo_1 = require("../util/fetchOrgInfo");
const nearbyLocationCal_1 = require("../util/nearbyLocationCal");
dotenv_1.default.config();
let imageInfoPrompt = "Identify the exact species of the animal in this image. Begin with a short paragraph (around 50 words) providing general information about the species. Then, check if the animal is injured. If injured, provide a step-by-step guide on first aid and immediate care before the volunteer reaches an NGO. Include its legal status and the safest, most ethical way to transport it to the NGO. Then, describe its natural habitat, diet, and behavior. Additionally, provide detailed care instructions, including proper handling, feeding, and ensuring its well-being in a safe and ethical manner, all in a structured points format.";
let imageInfoSummaryPrompt = "Below is detailed information about an animal. Please condense the details into a concise, information-dense summary that captures essential characteristics such as habitat, behavior, physical attributes, and conservation status. The resulting summary should be optimized for an AI to accurately match this animal with the best NGO or organization by comparing it with their summarized information.";
let bestNgoMatchPrompt = `"Below is detailed information about an animal species, followed by a list of NGOs with their respective names and summaries. Evaluate the provided data and rank the NGOs based on how well their mission, expertise, and focus align with the needs of the animal species. Your response should present the NGOs in descending order of suitability (the best suited first) and must be formatted in JSON.

Each NGO entry in the JSON response must include:
1. The NGO's **name**.
2. A **reason** explaining why the NGO is ranked in that position based on its compatibility with the provided animal species data.

Ensure your response follows this format:

{
  \"rankings\": [
    { 
      \"name\": \"Prairie Protectors\",
      \"reason\": \"Specializes in grassland conservation and has active programs for the species in question.\"
    },
    { 
      \"name\": \"Wild Haven Trust\",
      \"reason\": \"Has expertise in rescuing and rehabilitating this species within its native habitat.\"
    },
    { 
      \"name\": \"Biodiversity Boosters\",
      \"reason\": \"Engages in habitat restoration and advocacy efforts that benefit this species.\"
    }
  ]
}

Ensure that your ranking reflects the compatibility between the animal species data and each NGO's focus, with clear justification provided in the 'reason' field for each NGO. NOTE: always return in the above format, if not able to make rankings, simply return nothing but in above format."
`;
const imageResponse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const firebaseId = req.headers['x-firebase-id'];
    console.log("*********************");
    console.log("Firebase ID from headers:", firebaseId);
    try {
        // Fetch the location directly from req.body.location
        const userCurrentLocation = req.body.location;
        console.log("User current location is fetched: ", userCurrentLocation);
        // Safely extract latitude and longitude from userCurrentLocation
        let latitude, longitude;
        if (typeof userCurrentLocation === "string") {
            try {
                const parsed = JSON.parse(userCurrentLocation);
                latitude = parsed.latitude;
                longitude = parsed.longitude;
            }
            catch (err) {
                throw new Error("Invalid JSON in req.body.location");
            }
        }
        else if (typeof userCurrentLocation === "object" && userCurrentLocation !== null) {
            const locationObj = userCurrentLocation;
            latitude = locationObj.latitude;
            longitude = locationObj.longitude;
        }
        else {
            throw new Error("req.body.location is not in a valid format");
        }
        console.log("Parsed location: ", { latitude, longitude });
        const image = req.body.image;
        const imageSummary = yield (0, ImageInfo_1.geminiImageInfo)(image, imageInfoPrompt);
        imageInfoSummaryPrompt = imageInfoSummaryPrompt + imageSummary.text;
        const animalInfoSummary = yield (0, ImageInfoSummary_1.imageInfoSummary)(imageInfoSummaryPrompt);
        const allNgo = yield prisma_1.default.organization.findMany({
            select: {
                name: true,
                summary: true
            }
        });
        console.log("All NGOs: ", allNgo);
        const ngoJson = JSON.stringify({ allNgo }, null, 2);
        bestNgoMatchPrompt = bestNgoMatchPrompt + animalInfoSummary + ngoJson;
        const bestNgoMatchResponse = yield (0, ImageInfoSummary_1.imageInfoSummary)(bestNgoMatchPrompt);
        // Remove markdown code block syntax if present
        const cleanedResponse = bestNgoMatchResponse === null || bestNgoMatchResponse === void 0 ? void 0 : bestNgoMatchResponse.replace(/```json/g, "").replace(/```/g, "").trim();
        console.log("Best NGO Match Response: ", cleanedResponse);
        const bestNgoMatch = typeof cleanedResponse === 'string' ? JSON.parse(cleanedResponse) : bestNgoMatchResponse;
        const organizationNames = bestNgoMatch.rankings.map((org) => org.name);
        const allNgoData = yield (0, fetchOrgInfo_1.fetchOrganizations)(organizationNames);
        console.log(`*********************************${allNgoData}*******************************`);
        const extractNGOLocations = (ngos) => {
            return ngos
                .filter((ngo) => ngo && ngo.name && ngo.googleMapLocation) // Filter out invalid/undefined ngos
                .map(({ name, googleMapLocation }) => ({ name, googleMapLocation }));
        };
        const closeOrgs = (0, nearbyLocationCal_1.getClosestOrgs)(extractNGOLocations(allNgoData), { latitude, longitude });
        console.log("Closest Orgs:", closeOrgs);
        let finalResponse = (yield closeOrgs).map(org => {
            const matchingOrg = allNgoData.find((ngo) => (ngo === null || ngo === void 0 ? void 0 : ngo.name) === (org === null || org === void 0 ? void 0 : org.name));
            if (matchingOrg) {
                return Object.assign(Object.assign({}, org), { location: matchingOrg.location, emergencyResponse: matchingOrg.emergencyResponse, contactNumber: matchingOrg.contactNumber, emailAddress: matchingOrg.emailAddress, website: matchingOrg.website, focusArea: matchingOrg.focusArea, operatingHours: matchingOrg.operatingHours });
            }
            console.warn(`No match found for NGO: ${org.name}`);
            return org; // Return org without additional properties
        });
        finalResponse = [{ imageSummary: imageSummary.text }, ...finalResponse];
        console.log("Enriched closeOrgs:", finalResponse);
        res.json(finalResponse);
    }
    catch (error) {
        console.error("Error in imageResponse:", error);
        next(error);
    }
});
exports.imageResponse = imageResponse;
