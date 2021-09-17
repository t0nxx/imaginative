/*
  Warnings:

  - You are about to drop the column `pageType` on the `listings` table. All the data in the column will be lost.
  - You are about to drop the column `privacy` on the `listings` table. All the data in the column will be lost.
  - You are about to drop the column `stockAvailability` on the `listings` table. All the data in the column will be lost.
  - The `media` column on the `listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `socialLinks` column on the `listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "listings" DROP COLUMN "pageType",
DROP COLUMN "privacy",
DROP COLUMN "stockAvailability",
ADD COLUMN     "followCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isRepublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otherStockAvailability" VARCHAR(150),
ADD COLUMN     "pageTypeId" INTEGER,
ADD COLUMN     "privacyId" INTEGER,
ADD COLUMN     "shareCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stockAvailabilityId" INTEGER,
ADD COLUMN     "storiesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedFields" TEXT[],
DROP COLUMN "media",
ADD COLUMN     "media" TEXT[],
ALTER COLUMN "name" SET DATA TYPE VARCHAR(3000),
ALTER COLUMN "brandName" SET DATA TYPE VARCHAR(3000),
ALTER COLUMN "advantages" SET DATA TYPE VARCHAR(3000),
ALTER COLUMN "uses" SET DATA TYPE VARCHAR(3000),
ALTER COLUMN "url" SET DATA TYPE VARCHAR(3000),
DROP COLUMN "socialLinks",
ADD COLUMN     "socialLinks" TEXT[],
ALTER COLUMN "status" SET DEFAULT 0,
ALTER COLUMN "status" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "status" INTEGER NOT NULL DEFAULT 0;
