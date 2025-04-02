// volunteerProfileHandler.ts
import { Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { AuthenticatedRequest } from "../middlewares/middlewares"; // Adjust the path as needed


export const volunteerProfileHandler = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    // Extract profile data from request body
    const { currentLocation, skills, phone, } = req.body;
    console.log("Request body:", req.body); // Log the request body
    console.log(req)

    // Find the user in your database using firebaseId from the decoded token
    const user = await prisma.user.findUnique({
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
      ? skills.split(",").map((s: string) => s.trim())
      : [];

    // Prepare location data as JSON—if currentLocation is provided, wrap it in an object; otherwise, undefined.
    const locationData = currentLocation ? { value: currentLocation } : undefined;

    // Check if the volunteer profile already exists for this user
    let volunteerProfile = await prisma.volunteerProfile.findUnique({
      where: { userId: user.id },
    });

    if (volunteerProfile) {
      // Update existing volunteer profile
      volunteerProfile = await prisma.volunteerProfile.update({
        where: { userId: user.id },
        data: {
          phone,
          skills: skillsArray,
          location: locationData,
        },
      });
    } else {
      // Create a new volunteer profile using the relation connection.
      volunteerProfile = await prisma.volunteerProfile.create({
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
  } catch (error) {
    console.error("Error updating volunteer profile:", error);
    res.status(500).json({ message: "Error updating profile", error });
    return;
  }
};
