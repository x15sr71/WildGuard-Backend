"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// deleteUserScript.js
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')),
});
const firebaseUid = "NziYpL6wDYgvhso16xvo7jrxrVB2";
firebase_admin_1.default
    .auth()
    .deleteUser(firebaseUid)
    .then(() => {
    console.log(`Successfully deleted user: ${firebaseUid}`);
})
    .catch((error) => {
    console.error("Error deleting user:", error);
});
