/*
  Warnings:

  - You are about to alter the column `comment` on the `stories_comments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(3000)`.

*/
-- AlterTable
ALTER TABLE "listing_reviews" ALTER COLUMN "reviewText" SET DATA TYPE VARCHAR(3000);

-- AlterTable
ALTER TABLE "stories_comments" ALTER COLUMN "comment" SET DATA TYPE VARCHAR(3000);
