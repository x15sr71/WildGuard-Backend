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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const middlewares_1 = require("./middlewares/middlewares");
const userService_1 = require("./services/userService");
const imageResponse_1 = require("./services/imageResponse");
// import { saveUserLocation } from "./util/userLocation";
const concernPost_1 = require("./services/concernPost");
const postRequestHandler_1 = require("./services/postRequestHandler");
const volunteerProfileHandler_1 = require("./services/volunteerProfileHandler");
dotenv_1.default.config();
// Ensure all required environment variables are set
if (!process.env.FIREBASE_PROJECT_ID ||
    !process.env.FIREBASE_PRIVATE_KEY ||
    !process.env.FIREBASE_CLIENT_EMAIL) {
    console.error("❌ Missing Firebase credentials in .env file");
    process.exit(1);
}
console.log("✅ Firebase initialized successfully!");
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '100mb' })); // Move to top and increase limit
app.use(express_1.default.urlencoded({ limit: '100mb', extended: true }));
app.use((0, cors_1.default)());
app.post("/volunteer-profile", middlewares_1.authenticate, volunteerProfileHandler_1.volunteerProfileHandler);
// Global logger for every incoming request
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
app.post("/api/post-request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, postRequestHandler_1.handlePostRequest)(req, res);
}));
app.post("/animalHelpPost", concernPost_1.createAnimalHelpPost);
// app.post("/location", saveUserLocation)
// ✅ Public Route
app.get("/", (req, res) => {
    console.log("Public route '/' hit");
    res.send("🚀 Firebase Auth Server is Running!");
});
// Endpoint to analyze an image
app.post("/gemini", express_1.default.raw({ limit: '100mb', type: 'image/*' }), imageResponse_1.imageResponse);
// 🔒 Protected Route (Example)
app.get("/protected", middlewares_1.authenticate, (req, res) => {
    var _a;
    console.log("Protected route '/protected' hit by UID:", (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid);
    res.json({
        message: "This is a protected route!",
        user: req.user,
    });
});
// 🔒 API to Verify/Process Firebase Login and Store/Update User in DB
app.post("/auth/login", middlewares_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("POST /auth/login hit by UID:", (_a = req.user) === null || _a === void 0 ? void 0 : _a.uid);
    try {
        const decodedToken = req.user;
        const user = yield (0, userService_1.findOrCreateUser)(decodedToken);
        console.log("User processed successfully for UID:", decodedToken.uid);
        res.json({
            message: "User authenticated and verified",
            user,
        });
    }
    catch (error) {
        console.error("Error processing user:", error);
        res.status(500).json({ message: "Error processing user", error });
    }
}));
// 🚀 Start the server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`🔥 Server running on http://localhost:${PORT}`));
// Gracefully handle process termination
const shutdown = (signal) => {
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
