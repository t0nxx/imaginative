-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "info" VARCHAR(3000),
ALTER COLUMN "imaginativeYear" DROP NOT NULL,
ALTER COLUMN "imaginativeYear" SET DATA TYPE VARCHAR(3000);
