import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import { authenticate, AuthenticatedRequest } from "./middlewares/middlewares";
import { findOrCreateUser } from "./services/userService";
import { imageResponse } from "./services/imageResponse";
import { saveUserLocation } from "./util/userLocation";
import { createAnimalHelpPost } from "./services/concernPost";

dotenv.config();

// Ensure all required environment variables are set
if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_PRIVATE_KEY ||
  !process.env.FIREBASE_CLIENT_EMAIL
) {
  console.error("❌ Missing Firebase credentials in .env file");
  process.exit(1);
}

console.log("✅ Firebase initialized successfully!");

const app = express();
app.use(express.json());
app.use(cors());

// Global logger for every incoming request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.post("/animalHelpPost", createAnimalHelpPost)

app.post("/location", saveUserLocation)

// ✅ Public Route
app.get("/", (req: Request, res: Response) => {
  console.log("Public route '/' hit");
  res.send("🚀 Firebase Auth Server is Running!");
});

// Endpoint to analyze an image
app.post('/gemini', imageResponse);

// 🔒 Protected Route (Example)
app.get("/protected", authenticate, (req: AuthenticatedRequest, res: Response) => {
  console.log("Protected route '/protected' hit by UID:", req.user?.uid);
  res.json({
    message: "This is a protected route!",
    user: req.user,
  });
});

// 🔒 API to Verify/Process Firebase Login and Store/Update User in DB
app.post("/auth/login", authenticate, async (req: AuthenticatedRequest, res: Response) => {
  console.log("POST /auth/login hit by UID:", req.user?.uid);
  try {
    const decodedToken = req.user!;
    const user = await findOrCreateUser(decodedToken);
    console.log("User processed successfully for UID:", decodedToken.uid);
    res.json({
      message: "User authenticated and verified",
      user,
    });
  } catch (error) {
    console.error("Error processing user:", error);
    res.status(500).json({ message: "Error processing user", error });
  }
});

// 🚀 Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () =>
  console.log(`🔥 Server running on http://localhost:${PORT}`)
);

// Gracefully handle process termination
const shutdown = (signal: string) => {
  console.log(`\n🛑 Received ${signal}, shutting down server...`);
  server.close(() => {
    console.log("✅ Server closed. Exiting process.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("uncaughtException", (error) => {
  console.error("🚨 Uncaught Exception:", error);
  shutdown("uncaughtException");
});
