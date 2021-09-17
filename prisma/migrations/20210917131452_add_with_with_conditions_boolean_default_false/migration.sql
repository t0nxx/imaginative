-- AlterTable
ALTER TABLE "currencies" ADD COLUMN     "withConditions" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "disclaimers" ADD COLUMN     "withConditions" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "hiring_types" ADD COLUMN     "withConditions" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "imaginative_years" ADD COLUMN     "withConditions" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "listing_types" ADD COLUMN     "withConditions" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "price_types" ADD COLUMN     "withConditions" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "privacy" ADD COLUMN     "withConditions" BOOLEAN NOT NULL DEFAULT false;
