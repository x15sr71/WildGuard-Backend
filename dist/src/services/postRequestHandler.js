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
exports.handlePostRequest = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const handlePostRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firebaseId, images, description, incidentLocation, noticedAt, currentActions } = req.body;
        // Fetch the user based on Firebase ID
        const user = yield prisma_1.default.user.findUnique({
            where: { firebaseId },
            include: { volunteerProfile: true },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!user.volunteerProfile) {
            return res.status(400).json({ error: "User does not have a volunteer profile" });
        }
        let parsedIncidentLocation = null;
        if (typeof incidentLocation === "string") {
            try {
                parsedIncidentLocation = JSON.parse(incidentLocation);
            }
            catch (error) {
                console.error("Invalid JSON in incidentLocation:", error);
                return res.status(400).json({ error: "Invalid incident location format" });
            }
        }
        else if (typeof incidentLocation === "object" && incidentLocation !== null) {
            parsedIncidentLocation = incidentLocation;
        }
        else {
            return res.status(400).json({ error: "Incident location must be a valid JSON object" });
        }
        // Insert the AnimalHelpPost into the database
        const newHelpPost = yield prisma_1.default.animalHelpPost.create({
            data: {
                volunteerId: user.volunteerProfile.userId,
                images,
                description,
                incidentLocation: parsedIncidentLocation,
                noticedAt: new Date(noticedAt),
                currentActions,
            },
        });
        return res.status(201).json(newHelpPost);
    }
    catch (error) {
        console.error("Error handling post request:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.handlePostRequest = handlePostRequest;
