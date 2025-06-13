import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../../prisma/prisma";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { uploadToGCS } from "../util/gcsUploader";
import dotenv from "dotenv";

dotenv.config();

// Set up multer (store files in memory for direct upload to GCS)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      console.warn("Blocked file due to invalid mimetype:", file.mimetype);
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP files are allowed.') as any);
    }
  }
});
const uploadMiddleware = upload.array('images');

export const handlePostRequest = async (req: Request, res: Response) => {
  console.log("Received POST request to /api/post-request");

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error("Upload middleware error:", err);
      return res.status(400).json({ error: err.message });
    }

    try {
      console.log("Request body keys:", Object.keys(req.body));
      console.log("Raw req.body.data:", req.body.data);

      const formData = JSON.parse(req.body.data);
      console.log("Parsed formData:", formData);

      const uploadedFiles = req.files as Express.Multer.File[];
      console.log("Uploaded files count:", uploadedFiles?.length || 0);

      // Upload files to GCS and get public URLs
      const imageUrls: string[] = [];
      for (const file of uploadedFiles) {
        try {
          console.log(`Uploading file: ${file.originalname}, type: ${file.mimetype}`);
          const gcsUrl = await uploadToGCS(file.buffer, file.mimetype, `uploads/${uuidv4()}-${file.originalname}`);
          console.log(`Uploaded to GCS: ${gcsUrl}`);
          imageUrls.push(gcsUrl);
        } catch (uploadErr) {
          console.error(`Failed to upload ${file.originalname}:`, uploadErr);
          throw new Error(`Failed to upload image: ${file.originalname}`);
        }
      }

      const {
        firebaseId,
        description,
        incidentLocation,
        validNoticedAt,
        currentActions,
        animalType,
        urgencyLevel
      } = formData;

      console.log("Looking up user with Firebase ID:", firebaseId);

      const user = await prisma.user.findUnique({
        where: { firebaseId },
        include: { volunteerProfile: true },
      });

      if (!user) {
        console.warn("User not found for Firebase ID:", firebaseId);
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.volunteerProfile) {
        console.warn("User exists but no volunteer profile for:", firebaseId);
        return res.status(404).json({ error: "Volunteer profile not found" });
      }

      console.log("User and volunteer profile found:", {
        userId: user.id,
        volunteerId: user.volunteerProfile.userId
      });

      let geoLocationString: string | null = null;
      let placeValue = null;

      if (incidentLocation) {
        if (incidentLocation.place) {
          placeValue = incidentLocation.place;
        }
        if (incidentLocation.gpsLocation) {
          const { latitude, longitude } = incidentLocation.gpsLocation;
          geoLocationString = `${latitude},${longitude}`;
        }
      }

      console.log("Creating animalHelpPost with the following data:", {
        volunteerId: user.volunteerProfile.userId,
        images: imageUrls,
        description,
        incidentLocation: placeValue,
        geoLocation: geoLocationString,
        noticedAt: new Date(validNoticedAt),
        currentActions,
        animalType,
        urgencyLevel
      });

      const newHelpPost = await prisma.animalHelpPost.create({
        data: {
          volunteerId: user.volunteerProfile.userId,
          images: imageUrls,
          description,
          incidentLocation: placeValue || Prisma.JsonNull,
          geoLocation: geoLocationString,
          noticedAt: new Date(validNoticedAt),
          currentActions,
          animalType: animalType || undefined,
          urgencyLevel: urgencyLevel || "medium",
        },
      });

      console.log("Successfully created animalHelpPost  with ID:", newHelpPost.id);
      return res.status(201).json(newHelpPost);

    } catch (error: any) {
      console.error("Unhandled error in handlePostRequest:", error);
      if (error instanceof Error) {
        console.error("Stack trace:", error.stack);
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  });
};
