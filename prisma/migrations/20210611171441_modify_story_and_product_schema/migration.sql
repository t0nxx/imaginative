/*
  Warnings:

  - The `ownerId` column on the `listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `listingTypeId` column on the `listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priceTypeId` column on the `listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `currencyId` column on the `listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `hiringTypeId` column on the `listings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ownerId` column on the `stories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `listingId` column on the `stories` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `disclaimerId` column on the `stories` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "listings" DROP COLUMN "ownerId",
ADD COLUMN     "ownerId" INTEGER,
DROP COLUMN "listingTypeId",
ADD COLUMN     "listingTypeId" INTEGER,
DROP COLUMN "priceTypeId",
ADD COLUMN     "priceTypeId" INTEGER,
DROP COLUMN "currencyId",
ADD COLUMN     "currencyId" INTEGER,
DROP COLUMN "hiringTypeId",
ADD COLUMN     "hiringTypeId" INTEGER,
ALTER COLUMN "viewsCount" SET DEFAULT 0,
ALTER COLUMN "isEdited" SET DEFAULT false;

-- AlterTable
ALTER TABLE "stories" DROP COLUMN "ownerId",
ADD COLUMN     "ownerId" INTEGER,
DROP COLUMN "listingId",
ADD COLUMN     "listingId" INTEGER,
ALTER COLUMN "headerLine" SET DATA TYPE VARCHAR(3000),
DROP COLUMN "disclaimerId",
ADD COLUMN     "disclaimerId" INTEGER,
ALTER COLUMN "tagline" SET DATA TYPE VARCHAR(3000),
ALTER COLUMN "status" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "followersCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "productsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "storiesCount" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "stories" ADD FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "listings" ADD FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
