/*
  Warnings:

  - You are about to drop the column `email` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `googleMapLocation` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "email",
DROP COLUMN "googleMapLocation",
DROP COLUMN "phone",
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "emailAddress" TEXT,
ADD COLUMN     "googleMapLatitude" DOUBLE PRECISION,
ADD COLUMN     "googleMapLongitude" DOUBLE PRECISION;
