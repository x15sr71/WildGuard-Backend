import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/prisma";

export const createAnimalHelpPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { volunteerId, images, description, incidentLocation, noticedAt, currentActions } = req.body;
        // console.log(req.body);
        // console.log("*****************************************")
        console.log("Volunteer ID:", volunteerId);
    

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
        const newPost = await prisma.animalHelpPost.create({
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
    } catch (error) {
        console.error("Error creating animal help post:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
};
