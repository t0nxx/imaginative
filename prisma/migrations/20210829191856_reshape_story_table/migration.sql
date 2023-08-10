/*
  Warnings:

  - You are about to drop the column `imaginativeYear` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the column `media` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the column `privacy` on the `stories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stories" DROP COLUMN "imaginativeYear",
DROP COLUMN "media",
DROP COLUMN "privacy",
ADD COLUMN     "bodyImage" VARCHAR(3000),
ADD COLUMN     "conclusionImage" VARCHAR(3000),
ADD COLUMN     "imaginativeYearId" INTEGER,
ADD COLUMN     "introImage" VARCHAR(3000),
ADD COLUMN     "privacyId" INTEGER,
ALTER COLUMN "headerLine" DROP NOT NULL,
ALTER COLUMN "headerImage" SET DATA TYPE VARCHAR(3000);
