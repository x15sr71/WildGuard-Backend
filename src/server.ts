import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";
import path from "path";
import { authenticate, AuthenticatedRequest } from "./middlewares/middlewares";
import { findOrCreateUser } from "./services/userService";
import { imageResponse } from "./services/imageResponse";
// import { saveUserLocation } from "./util/userLocation";
import { createAnimalHelpPost } from "./services/concernPost";
import { handlePostRequest } from "./services/postRequestHandler";
import { volunteerProfileHandler } from "./services/volunteerProfileHandler";
import postsRouter from "./middlewares/postRoute";


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



app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));
app.use(express.json({ limit: '100mb' })); // Move to top and increase limit
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cors({
  origin: [
    "https://wildgaurd-backend-794553988056.asia-south1.run.app", 
    "http://localhost:5173",
    "http://localhost:8080"
  ],
  credentials: true,
}));



app.use("/api/posts", postsRouter);


app.post("/volunteer-profile", authenticate, volunteerProfileHandler);


// Global logger for every incoming request
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});


app.post("/api/post-request", async (req, res) => {
  await handlePostRequest(req, res);
});


app.post("/animalHelpPost", createAnimalHelpPost)


// app.post("/location", saveUserLocation)


// ✅ Public Route
app.get("/", (req: Request, res: Response) => {
  console.log("Public route '/' hit");
  res.send("🚀 Firebase Auth Server is Running!");
});


// Endpoint to analyze an image
app.post("/gemini", express.raw({ limit: '100mb', type: 'image/*' }), imageResponse);


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
const PORT = process.env.PORT || 8080;


const server = app.listen(PORT, () =>
  console.log(`🔥 Server running on http://localhost:${PORT}`)
);


// Improved graceful shutdown handling
let isShuttingDown = false;

const shutdown = (signal: string) => {
  if (isShuttingDown) {
    console.log("⚠️ Shutdown already in progress...");
    return;
  }
  
  isShuttingDown = true;
  console.log(`\n🛑 Received ${signal}, shutting down server gracefully...`);
  
  // Set a timeout to force exit if server doesn't close within 10 seconds
  const forceExit = setTimeout(() => {
    console.log("⚠️ Force closing server after timeout");
    process.exit(1);
  }, 10000);
  
  server.close((err) => {
    clearTimeout(forceExit);
    if (err) {
      console.error("❌ Error during server shutdown:", err);
      process.exit(1);
    }
    console.log("✅ Server closed gracefully. Goodbye!");
    process.exit(0);
  });
};


// Handle Ctrl+C (SIGINT) and other termination signals
process.on("SIGINT", () => shutdown("SIGINT (Ctrl+C)"));
process.on("SIGTERM", () => shutdown("SIGTERM"));


process.on("uncaughtException", (error) => {
  console.error("🚨 Uncaught Exception:", error);
  shutdown("uncaughtException");
});
