/*
  Warnings:

  - You are about to drop the column `media` on the `stories` table. All the data in the column will be lost.
  - The `imaginativeYear` column on the `stories` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "stories" DROP COLUMN "media",
DROP COLUMN "imaginativeYear",
ADD COLUMN     "imaginativeYear" INTEGER;
