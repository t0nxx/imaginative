/*
  Warnings:

  - You are about to drop the column `status` on the `stories` table. All the data in the column will be lost.
  - The `media` column on the `stories` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "stories" DROP COLUMN "status",
ADD COLUMN     "headerImage" INTEGER,
ADD COLUMN     "otherImaginativeYear" VARCHAR(3000),
DROP COLUMN "media",
ADD COLUMN     "media" INTEGER[];
