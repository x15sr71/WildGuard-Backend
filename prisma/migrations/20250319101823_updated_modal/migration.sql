-- CreateTable
CREATE TABLE "AnimalHelpPost" (
    "id" TEXT NOT NULL,
    "volunteerId" TEXT NOT NULL,
    "images" TEXT[],
    "description" TEXT NOT NULL,
    "incidentLocation" TEXT NOT NULL,
    "noticedAt" TIMESTAMP(3) NOT NULL,
    "currentActions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnimalHelpPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnimalHelpPost" ADD CONSTRAINT "AnimalHelpPost_volunteerId_fkey" FOREIGN KEY ("volunteerId") REFERENCES "VolunteerProfile"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
