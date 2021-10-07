-- AlterTable
ALTER TABLE "listings" ADD COLUMN     "usesTypeId" INTEGER;

-- AlterIndex
ALTER INDEX "user_settings_userId_unique" RENAME TO "user_settings.userId_unique";
