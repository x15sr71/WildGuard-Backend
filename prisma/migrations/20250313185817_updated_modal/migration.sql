/*
  Warnings:

  - You are about to drop the column `affiliations` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `educationalPrograms` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `emergencyContacts` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `focusAreas` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `fundingSources` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `licensesCertifications` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `servicesOffered` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `speciesSpecialization` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `volunteerOpportunities` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Volunteer` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[firebaseId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firebaseId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Organization" DROP CONSTRAINT "Organization_userId_fkey";

-- DropForeignKey
ALTER TABLE "Volunteer" DROP CONSTRAINT "Volunteer_userId_fkey";

-- DropIndex
DROP INDEX "Organization_userId_key";

-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "affiliations",
DROP COLUMN "educationalPrograms",
DROP COLUMN "emergencyContacts",
DROP COLUMN "focusAreas",
DROP COLUMN "fundingSources",
DROP COLUMN "licensesCertifications",
DROP COLUMN "servicesOffered",
DROP COLUMN "speciesSpecialization",
DROP COLUMN "userId",
DROP COLUMN "volunteerOpportunities",
ALTER COLUMN "geographicalCoverage" DROP NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "operatingHours" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
DROP COLUMN "role",
ADD COLUMN     "firebaseId" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;

-- DropTable
DROP TABLE "Volunteer";

-- DropEnum
DROP TYPE "UserRole";

-- CreateTable
CREATE TABLE "VolunteerProfile" (
    "userId" TEXT NOT NULL,
    "skills" TEXT[],
    "phone" TEXT NOT NULL,
    "location" TEXT,

    CONSTRAINT "VolunteerProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_firebaseId_key" ON "User"("firebaseId");

-- AddForeignKey
ALTER TABLE "VolunteerProfile" ADD CONSTRAINT "VolunteerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
