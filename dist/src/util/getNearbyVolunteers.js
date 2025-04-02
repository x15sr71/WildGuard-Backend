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
exports.getNearbyVolunteers = getNearbyVolunteers;
const prisma_1 = __importDefault(require("../../prisma/prisma"));
console.log("✅ Prisma initialized successfully!");
function getNearbyVolunteers(postLatitude, postLongitude, radiusKm) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🚀 Running query...");
        console.log(`🔍 Searching for volunteers within ${radiusKm} km...`);
        const radiusMeters = radiusKm * 1000;
        // Construct a well-known text (WKT) point for the post's location
        const pointWKT = `SRID=4326;POINT(${postLongitude} ${postLatitude})`;
        // Log the post location details
        console.log("📍 Post location details:");
        console.log(`   - Latitude: ${postLatitude}`);
        console.log(`   - Longitude: ${postLongitude}`);
        console.log(`   - WKT: ${pointWKT}`);
        try {
            const query = `
      SELECT "userId", "email", "phone", "geoLocation"
      FROM "VolunteerProfile"
      WHERE "geoLocation" IS NOT NULL
      AND ST_DWithin(
        "geoLocation",
        ST_GeogFromText('${pointWKT}'),
        ${radiusMeters}::double precision
      );
    `;
            console.log("Running query:", query);
            const volunteers = yield prisma_1.default.$queryRawUnsafe(query);
            console.log("✅ Volunteers found:", volunteers);
            return volunteers;
        }
        catch (error) {
            console.error("❌ Error fetching nearby volunteers:", error);
            return [];
        }
    });
}
// Example test call using Delhi coordinates and a 10 km radius
getNearbyVolunteers(28.6139, 77.2090, 10)
    .then(() => console.log("🔄 Query complete"))
    .catch((err) => console.error("Unhandled error:", err));
