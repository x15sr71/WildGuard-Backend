import { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";
import { geminiImageInfo } from '../LLM/ImageInfo';
import { imageInfoSummary } from '../LLM/ImageInfoSummary';
import prisma from '../../prisma/prisma';
import { fetchOrganizations } from '../util/fetchOrgInfo';
import { getClosestOrgs } from '../util/nearbyLocationCal';

dotenv.config();

type NGO = {
  name: string;
  googleMapLocation: { latitude: number; longitude: number };
};

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

Ensure that your ranking reflects the compatibility between the animal species data and each NGO's focus, with clear justification provided in the 'reason' field for each NGO."
`;

export const imageResponse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Fetch the user and ensure currentLocation exists
    const userLocation = await prisma.user.findFirst({
      where: { id: "7e5beb5e-fa49-4878-b6f4-8f28b272c4bc" },
      select: { currentLocation: true }
    });
    
    if (!userLocation?.currentLocation) {
      throw new Error("User location not found or invalid.");
    }

    // Safely extract latitude and longitude
    let latitude: number, longitude: number;
    if (typeof userLocation.currentLocation === "string") {
      try {
        const parsed = JSON.parse(userLocation.currentLocation) as { latitude: number; longitude: number };
        latitude = parsed.latitude;
        longitude = parsed.longitude;
      } catch (err) {
        throw new Error("Invalid JSON in userLocation.currentLocation");
      }
    } else if (typeof userLocation.currentLocation === "object" && userLocation.currentLocation !== null) {
      const locationObj = userLocation.currentLocation as { latitude: number; longitude: number };
      latitude = locationObj.latitude;
      longitude = locationObj.longitude;
    } else {
      throw new Error("userLocation.currentLocation is not in a valid format");
    }

    console.log("User current location is fetched: ", userLocation);
    
    const image = req.body.image;
    const imageSummary = await geminiImageInfo(image, imageInfoPrompt);
    imageInfoSummaryPrompt = imageInfoSummaryPrompt + imageSummary.text;

    const animalInfoSummary = await imageInfoSummary(imageInfoSummaryPrompt);

    const allNgo = await prisma.organization.findMany({
      select: {
        name: true,
        summary: true
      }
    });

    const ngoJson: string = JSON.stringify({ allNgo }, null, 2);
    bestNgoMatchPrompt = bestNgoMatchPrompt + animalInfoSummary + ngoJson;

    const bestNgoMatchResponse = await imageInfoSummary(bestNgoMatchPrompt);
    // Remove markdown code block syntax if present
    const cleanedResponse = bestNgoMatchResponse?.replace(/```json/g, "").replace(/```/g, "").trim();

    const bestNgoMatch = typeof cleanedResponse === 'string' ? JSON.parse(cleanedResponse) : bestNgoMatchResponse;
    const organizationNames = bestNgoMatch.rankings.map((org: any) => org.name);

    const allNgoData = await fetchOrganizations(organizationNames);
    const extractNGOLocations = (ngos: any[]): NGO[] => {
      return ngos.map(({ name, googleMapLocation }) => ({ name, googleMapLocation }));
    };

    const closeOrgs = getClosestOrgs(extractNGOLocations(allNgoData), { latitude, longitude });

    let finalResponse = (await closeOrgs).map(org => {
      const matchingOrg = allNgoData.find((ngo: any) => ngo.name === org.name);
      if (matchingOrg) {
        return {
          ...org,
          location: matchingOrg.location,
          emergencyResponse: matchingOrg.emergencyResponse,
          contactNumber: matchingOrg.contactNumber,
          emailAddress: matchingOrg.emailAddress,
          website: matchingOrg.website,
          focusArea: matchingOrg.focusArea,
          operatingHours: matchingOrg.operatingHours
        };
      }
      return org;
    });
    finalResponse = [{ imageSummary: imageSummary.text } as any, ...finalResponse];
    
    console.log("Enriched closeOrgs:", finalResponse);
    res.json(finalResponse);
  } catch (error) {
    console.error("Error in imageResponse:", error);
    next(error);
  }
};
