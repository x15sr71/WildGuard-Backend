-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "affiliations" TEXT,
ADD COLUMN     "educationalPrograms" TEXT,
ADD COLUMN     "emergencyResponse" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "focusArea" TEXT,
ADD COLUMN     "fundingSources" TEXT,
ADD COLUMN     "googleMapLatitude" DOUBLE PRECISION,
ADD COLUMN     "googleMapLongitude" DOUBLE PRECISION,
ADD COLUMN     "licensesCertifications" TEXT,
ADD COLUMN     "servicesOffered" TEXT,
ADD COLUMN     "speciesSpecialization" TEXT,
ADD COLUMN     "successStories" TEXT,
ADD COLUMN     "volunteerOpportunities" BOOLEAN NOT NULL DEFAULT false;
