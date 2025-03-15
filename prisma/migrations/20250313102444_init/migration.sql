-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "website" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);
