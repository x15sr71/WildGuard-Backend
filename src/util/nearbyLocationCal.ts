import { Request, Response } from 'express';
import prisma from '../../prisma/prisma';

// Haversine formula to calculate distance between two points (in km)
const haversineDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const toRad = (angle: number) => (Math.PI / 180) * angle;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in km
};

type Organization = {
  name: string;
  googleMapLocation: { latitude: number; longitude: number };
  // ... other properties if needed
};

type UserLocation = {
  latitude: number;
  longitude: number;
};

export const getClosestOrgs = async (
  Orgs: Organization[],
  userLocation: UserLocation
) => {
  try {
    const { latitude: userLat, longitude: userLon } = userLocation;

    const sortedOrgs = Orgs
      .map((org) => ({
        ...org,
        distance: haversineDistance(
          userLat,
          userLon,
          org.googleMapLocation.latitude,
          org.googleMapLocation.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance) // Sort in ascending order (closest first)
      .slice(0, 10); // Return top 5 closest organizations

    return sortedOrgs;
    // If using an Express response, you could do:
    // res.json({ closestOrgs: sortedOrgs });
  } catch (error) {
    console.error("Error fetching closest Orgs:", error);
    throw error;
    // Alternatively, send a 500 error response:
    // res.status(500).json({ error: "Internal Server Error" });
  }
};
