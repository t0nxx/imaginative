-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "rate1Count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rate2Count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rate3Count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rate4Count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rate5Count" INTEGER NOT NULL DEFAULT 0;
