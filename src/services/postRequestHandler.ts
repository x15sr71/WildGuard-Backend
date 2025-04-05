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
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP files are allowed.') as any);
    }
  }
});
const uploadMiddleware = upload.array('images');

export const handlePostRequest = async (req: Request, res: Response) => {
  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({ error: err.message });
    }

    try {
      const formData = JSON.parse(req.body.data);
      const uploadedFiles = req.files as Express.Multer.File[];

      // Upload files to GCS and get public URLs
      const imageUrls: string[] = [];
      for (const file of uploadedFiles) {
        const gcsUrl = await uploadToGCS(file.buffer, file.mimetype, `uploads/${uuidv4()}-${file.originalname}`);
        imageUrls.push(gcsUrl);
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

      const user = await prisma.user.findUnique({
        where: { firebaseId },
        include: { volunteerProfile: true },
      });

      if (!user || !user.volunteerProfile) {
        return res.status(404).json({ error: "User or volunteer profile not found" });
      }

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

      return res.status(201).json(newHelpPost);
    } catch (error) {
      console.error("Error handling post request:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
};
