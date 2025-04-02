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
exports.createAnimalHelpPost = void 0;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
const createAnimalHelpPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { volunteerId, images, description, incidentLocation, noticedAt, currentActions } = req.body;
        console.log(req.body);
        // Validate required fields
        if (!volunteerId || !description || !incidentLocation || !noticedAt || !currentActions) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        // Validate noticedAt is a valid date
        const parsedDate = new Date(noticedAt);
        if (isNaN(parsedDate.getTime())) {
            res.status(400).json({ error: "Invalid date format for noticedAt" });
            return;
        }
        // Ensure images array is properly formatted
        if (images && (!Array.isArray(images) || images.some(img => typeof img !== "string"))) {
            res.status(400).json({ error: "Invalid image format" });
            return;
        }
        // Create new animal help post
        const newPost = yield prisma_1.default.animalHelpPost.create({
            data: {
                volunteerId: "7e5beb5e-fa49-4878-b6f4-8f28b272c4bc",
                images: images || [],
                description,
                incidentLocation,
                noticedAt: parsedDate,
                currentActions,
            },
        });
        res.status(201).json({ message: "Animal help post created successfully", post: newPost });
        return;
    }
    catch (error) {
        console.error("Error creating animal help post:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
});
exports.createAnimalHelpPost = createAnimalHelpPost;
