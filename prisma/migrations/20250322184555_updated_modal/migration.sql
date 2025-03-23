/*
  Warnings:

  - The `location` column on the `VolunteerProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AnimalHelpPost" ADD COLUMN     "geoLocation" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "VolunteerProfile" ADD COLUMN     "geoLocation" TEXT DEFAULT '',
DROP COLUMN "location",
ADD COLUMN     "location" JSONB;
