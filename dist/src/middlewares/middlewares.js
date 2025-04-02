"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const firebase_1 = __importDefault(require("../firebase"));
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    console.log("Authenticate middleware: received token:", token ? "Token provided" : "No token provided");
    if (!token) {
        console.error("Authentication failed: No token provided");
        res.status(401).json({ message: "Unauthorized - No token provided" });
        return;
    }
    firebase_1.default
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
        console.log("Token verified successfully for UID:", decodedToken.uid);
        req.user = decodedToken;
        next();
    })
        .catch((error) => {
        console.error("Token verification error:", error);
        res.status(403).json({ message: "Invalid token", error });
    });
};
exports.authenticate = authenticate;
