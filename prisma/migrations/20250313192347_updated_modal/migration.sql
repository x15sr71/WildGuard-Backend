-- AlterTable
ALTER TABLE "Organization" ALTER COLUMN "emergencyResponse" DROP NOT NULL,
ALTER COLUMN "emergencyResponse" DROP DEFAULT,
ALTER COLUMN "emergencyResponse" SET DATA TYPE TEXT,
ALTER COLUMN "volunteerOpportunities" DROP NOT NULL,
ALTER COLUMN "volunteerOpportunities" DROP DEFAULT,
ALTER COLUMN "volunteerOpportunities" SET DATA TYPE TEXT;
