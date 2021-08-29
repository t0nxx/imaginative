/*
  Warnings:

  - You are about to drop the column `name` on the `privacy` table. All the data in the column will be lost.
  - Added the required column `code` to the `privacy` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "privacy" DROP COLUMN "name",
ADD COLUMN     "code" VARCHAR(128) NOT NULL;
