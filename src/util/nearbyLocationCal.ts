import { Request, Response } from 'express';
import prisma from '../../prisma/prisma';

// Haversine formula to calculate distance between two points (in km)
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const toRad = (angle: number) => (Math.PI / 180) * angle;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
};

export const getClosestNGOs = async () => {
    try {
        // Calculate distance for each NGO and sort by closest
        const sortedNGOs = ngos
            .map(ngo => ({
                ...ngo,
                distance: haversineDistance(latitude, longitude, ngo.latitude, ngo.longitude)
            }))
            .sort((a, b) => a.distance - b.distance) // Sort ascending (closest first)
            .slice(0, 5); // Get top 5 closest NGOs

        //res.json({ closestNGOs: sortedNGOs });

    } catch (error) {
        console.error("Error fetching closest NGOs:", error);
        ///res.status(500).json({ error: "Internal Server Error" });
    }
};
