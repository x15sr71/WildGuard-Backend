/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `geographicalCoverage` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `operatingHours` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('VOLUNTEER', 'NGO_ADMIN');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "affiliations" TEXT[],
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "educationalPrograms" TEXT[],
ADD COLUMN     "emergencyContacts" TEXT[],
ADD COLUMN     "focusAreas" TEXT[],
ADD COLUMN     "fundingSources" TEXT[],
ADD COLUMN     "geographicalCoverage" TEXT NOT NULL,
ADD COLUMN     "licensesCertifications" TEXT[],
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "operatingHours" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "servicesOffered" TEXT[],
ADD COLUMN     "speciesSpecialization" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD COLUMN     "volunteerOpportunities" TEXT[],
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Volunteer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "skills" TEXT[],
    "location" TEXT NOT NULL,

    CONSTRAINT "Volunteer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Volunteer_userId_key" ON "Volunteer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_userId_key" ON "Organization"("userId");

-- AddForeignKey
ALTER TABLE "Volunteer" ADD CONSTRAINT "Volunteer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
