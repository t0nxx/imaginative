/*
  Warnings:

  - You are about to drop the column `bodyImage` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the column `conclusionImage` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the column `introImage` on the `stories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stories" DROP COLUMN "bodyImage",
DROP COLUMN "conclusionImage",
DROP COLUMN "introImage",
ADD COLUMN     "bodyImages" TEXT[],
ADD COLUMN     "conclusionImages" TEXT[],
ADD COLUMN     "introImages" TEXT[];
