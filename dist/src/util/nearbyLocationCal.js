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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClosestOrgs = void 0;
// Haversine formula to calculate distance between two points (in km)
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const toRad = (angle) => (Math.PI / 180) * angle;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};
const getClosestOrgs = (Orgs, userLocation) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { latitude: userLat, longitude: userLon } = userLocation;
        const sortedOrgs = Orgs
            .map((org) => (Object.assign(Object.assign({}, org), { distance: haversineDistance(userLat, userLon, org.googleMapLocation.latitude, org.googleMapLocation.longitude) })))
            .sort((a, b) => a.distance - b.distance) // Sort in ascending order (closest first)
            .slice(0, 10); // Return top 5 closest organizations
        return sortedOrgs;
        // If using an Express response, you could do:
        // res.json({ closestOrgs: sortedOrgs });
    }
    catch (error) {
        console.error("Error fetching closest Orgs:", error);
        throw error;
        // Alternatively, send a 500 error response:
        // res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getClosestOrgs = getClosestOrgs;
