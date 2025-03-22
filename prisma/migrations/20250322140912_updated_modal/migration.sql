/*
  Warnings:

  - The `incidentLocation` column on the `AnimalHelpPost` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `currentLocation` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AnimalHelpPost" DROP COLUMN "incidentLocation",
ADD COLUMN     "incidentLocation" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageUrl" TEXT,
DROP COLUMN "currentLocation",
ADD COLUMN     "currentLocation" JSONB;

-- AlterTable
ALTER TABLE "VolunteerProfile" ADD COLUMN     "email" TEXT,
ADD COLUMN     "imageUrl" TEXT;
