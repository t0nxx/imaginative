-- AlterTable
ALTER TABLE "listings" ALTER COLUMN "offerPrice" DROP NOT NULL,
ALTER COLUMN "offerDescription" DROP NOT NULL,
ALTER COLUMN "overallRating" SET DEFAULT 0,
ALTER COLUMN "totalRatingCount" SET DEFAULT 0;
