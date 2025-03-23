import prisma from "../../prisma/prisma";

console.log("✅ Prisma initialized successfully!");

export async function getNearbyVolunteers(postLatitude: number, postLongitude: number, radiusKm: number) {
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

    const volunteers = await prisma.$queryRawUnsafe(query);

    console.log("✅ Volunteers found:", volunteers);
    return volunteers;
  } catch (error) {
    console.error("❌ Error fetching nearby volunteers:", error);
    return [];
  }
}

// Example test call using Delhi coordinates and a 10 km radius
getNearbyVolunteers(28.6139, 77.2090, 10)
  .then(() => console.log("🔄 Query complete"))
  .catch((err) => console.error("Unhandled error:", err));
