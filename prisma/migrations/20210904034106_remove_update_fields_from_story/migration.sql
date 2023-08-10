/*
  Warnings:

  - You are about to drop the column `updatedFields` on the `stories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "stories" DROP COLUMN "updatedFields",
ADD COLUMN     "productViewCount" INTEGER NOT NULL DEFAULT 0;
