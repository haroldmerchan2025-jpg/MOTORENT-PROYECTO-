/*
  Warnings:

  - Made the column `transitLicenseImage` on table `MotoDocument` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "MotoDocument" ALTER COLUMN "transitLicenseImage" SET NOT NULL;
