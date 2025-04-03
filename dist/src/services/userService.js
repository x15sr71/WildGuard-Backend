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
exports.findOrCreateUser = findOrCreateUser;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
function findOrCreateUser(decodedToken) {
    return __awaiter(this, void 0, void 0, function* () {
        // Look for the user in the database by their Firebase UID.
        let user = yield prisma_1.default.user.findUnique({
            where: { firebaseId: decodedToken.uid },
        });
        if (user) {
            console.log("User found in database:", {
                firebaseId: user.firebaseId,
                email: user.email,
                name: user.name,
            });
            return user;
        }
        // Log details extracted from the token
        console.log("User not found in database. Creating new user with details:");
        console.log("firebaseId:", decodedToken.uid);
        console.log("email:", decodedToken.email);
        console.log("name:", decodedToken.name);
        if (decodedToken.picture) {
            console.log("profilePicture:", decodedToken.picture);
        }
        // Create a new user record in the database
        user = yield prisma_1.default.user.create({
            data: {
                firebaseId: decodedToken.uid,
                email: decodedToken.email || "",
                name: decodedToken.name || "",
                imageUrl: decodedToken.picture || undefined, // Optional
                // Extend your Prisma model if you need to store a profile picture.
            },
        });
        console.log("New user created:", {
            firebaseId: user.firebaseId,
            email: user.email,
            name: user.name,
            imageUrl: user.imageUrl,
        });
        return user;
    });
}
