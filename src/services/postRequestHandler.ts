import { Request, Response } from "express";
import { Prisma } from "@prisma/client"; // Import Prisma types
import prisma from "../../prisma/prisma";

export const handlePostRequest = async (req: Request, res: Response) => {
  try {
    const { firebaseId, images, description, incidentLocation, noticedAt, currentActions } = req.body;

    // Fetch the user based on Firebase ID
    const user = await prisma.user.findUnique({
      where: { firebaseId },
      include: { volunteerProfile: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.volunteerProfile) {
      return res.status(400).json({ error: "User does not have a volunteer profile" });
    }

    let parsedIncidentLocation: Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue;

    if (typeof incidentLocation === "string") {
      try {
        parsedIncidentLocation = JSON.parse(incidentLocation);
      } catch (error) {
        console.error("Invalid JSON in incidentLocation:", error);
        return res.status(400).json({ error: "Invalid incident location format" });
      }
    } else if (typeof incidentLocation === "object" && incidentLocation !== null) {
      parsedIncidentLocation = incidentLocation;
    } else {
      parsedIncidentLocation = Prisma.JsonNull; // FIX: Use Prisma.JsonNull instead of null
    }

    // Insert the AnimalHelpPost into the database
    const newHelpPost = await prisma.animalHelpPost.create({
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
  } catch (error) {
    console.error("Error handling post request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
