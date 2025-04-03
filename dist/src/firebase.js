"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Prevent duplicate initialization
if (!firebase_admin_1.default.apps.length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        try {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            firebase_admin_1.default.initializeApp({
                credential: firebase_admin_1.default.credential.cert(serviceAccount),
            });
        }
        catch (error) {
            console.error("Error parsing FIREBASE_SERVICE_ACCOUNT:", error);
            process.exit(1);
        }
    }
    else {
        console.error("❌ FIREBASE_SERVICE_ACCOUNT is not defined in .env");
        process.exit(1);
    }
}
exports.default = firebase_admin_1.default;
