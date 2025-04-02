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
exports.volunteerProfileHandler = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const volunteerProfileHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    try {
        // Extract profile data from request body
        const { currentLocation, skills, phone, } = req.body;
        console.log("Request body:", req.body); // Log the request body
        console.log(req);
        // Find the user in your database using firebaseId from the decoded token
        const user = yield prisma_1.default.user.findUnique({
            where: { firebaseId: req.user.uid },
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        console.log("Found user:", user); // Log the user record
        // Convert skills to an array if it's a comma-separated string
        const skillsArray = Array.isArray(skills)
            ? skills
            : skills
                ? skills.split(",").map((s) => s.trim())
                : [];
        // Prepare location data as JSON—if currentLocation is provided, wrap it in an object; otherwise, undefined.
        const locationData = currentLocation ? { value: currentLocation } : undefined;
        // Check if the volunteer profile already exists for this user
        let volunteerProfile = yield prisma_1.default.volunteerProfile.findUnique({
            where: { userId: user.id },
        });
        if (volunteerProfile) {
            // Update existing volunteer profile
            volunteerProfile = yield prisma_1.default.volunteerProfile.update({
                where: { userId: user.id },
                data: {
                    phone,
                    skills: skillsArray,
                    location: locationData,
                },
            });
        }
        else {
            // Create a new volunteer profile using the relation connection.
            volunteerProfile = yield prisma_1.default.volunteerProfile.create({
                data: {
                    // Use connect syntax to associate the profile with an existing user.
                    user: { connect: { id: user.id } },
                    phone,
                    skills: skillsArray,
                    location: locationData,
                },
            });
        }
        res.status(200).json({
            message: "Profile updated successfully",
            volunteerProfile,
        });
        return;
    }
    catch (error) {
        console.error("Error updating volunteer profile:", error);
        res.status(500).json({ message: "Error updating profile", error });
        return;
    }
});
exports.volunteerProfileHandler = volunteerProfileHandler;
