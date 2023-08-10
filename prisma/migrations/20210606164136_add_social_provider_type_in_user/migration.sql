/*
  Warnings:

  - You are about to drop the column `facebookId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AccountTypeProviderEnum" AS ENUM ('local', 'facebook', 'google', 'apple');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "facebookId",
DROP COLUMN "googleId",
ADD COLUMN     "provider" "AccountTypeProviderEnum" NOT NULL DEFAULT E'local';
