/*
  Warnings:

  - You are about to drop the column `goodAboutListing` on the `listing_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `notGoodAboutListing` on the `listing_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `listing_reviews` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `listing_reviews` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `listing_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "listing_reviews" DROP COLUMN "goodAboutListing",
DROP COLUMN "notGoodAboutListing",
DROP COLUMN "title",
DROP COLUMN "userId",
ADD COLUMN     "ownerId" INTEGER NOT NULL;
