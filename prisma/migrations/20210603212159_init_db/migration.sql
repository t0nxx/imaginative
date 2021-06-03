-- CreateTable
CREATE TABLE "SequelizeMeta" (
    "name" VARCHAR(255) NOT NULL,

    PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "currencies" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(500) NOT NULL,
    "symbol" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localized_currencies" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "standardCode" VARCHAR(255) NOT NULL,
    "language" VARCHAR(255) NOT NULL,
    "refId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localized_price_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "format" VARCHAR(150) NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "refId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disclaimers" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(150) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localized_disclaimers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "refId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hiring_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(128) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localized_hiring_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "refId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_types" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(150) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localized_listing_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "language" VARCHAR(255) NOT NULL,
    "refId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_followers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listings" (
    "id" SERIAL NOT NULL,
    "ownerId" VARCHAR(50) NOT NULL,
    "pageType" VARCHAR(50) NOT NULL,
    "listingTypeId" VARCHAR(50) NOT NULL,
    "privacy" VARCHAR(50) NOT NULL,
    "media" JSON NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "brandName" VARCHAR(200) NOT NULL,
    "description" VARCHAR(3000) NOT NULL,
    "stockAvailability" VARCHAR(70) NOT NULL,
    "advantages" VARCHAR(2000) NOT NULL,
    "uses" VARCHAR(1500) NOT NULL,
    "credentials" VARCHAR(3000) NOT NULL,
    "url" VARCHAR(400) NOT NULL,
    "priceTypeId" VARCHAR(50) NOT NULL,
    "otherPriceType" VARCHAR(150),
    "price" DOUBLE PRECISION NOT NULL,
    "currencyId" VARCHAR(50),
    "hiringTypeId" VARCHAR(50),
    "otherHiring" VARCHAR(150),
    "offerPrice" DOUBLE PRECISION NOT NULL,
    "offerDescription" VARCHAR(3000) NOT NULL,
    "socialLinks" JSON NOT NULL,
    "viewsCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" SMALLINT NOT NULL,
    "isEdited" BOOLEAN NOT NULL,
    "overallRating" DOUBLE PRECISION NOT NULL,
    "totalRatingCount" DOUBLE PRECISION NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "listing_reviews" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "goodAboutListing" VARCHAR(50) NOT NULL,
    "notGoodAboutListing" VARCHAR(50) NOT NULL,
    "reviewText" VARCHAR(500) NOT NULL,
    "starRating" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stories" (
    "id" SERIAL NOT NULL,
    "ownerId" VARCHAR(50) NOT NULL,
    "listingId" VARCHAR(50),
    "privacy" VARCHAR(50) NOT NULL,
    "media" JSON NOT NULL,
    "headerLine" VARCHAR(200) NOT NULL,
    "disclaimerId" VARCHAR(50) NOT NULL,
    "intro" VARCHAR(3000),
    "body" VARCHAR(3000),
    "tagline" VARCHAR(200),
    "conclusion" VARCHAR(3000),
    "imaginativeYear" INTEGER NOT NULL,
    "status" SMALLINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(500) NOT NULL,
    "email" VARCHAR(500) NOT NULL,
    "photoUrl" TEXT NOT NULL DEFAULT E'https://gravatar.com/avatar/14978c9024af3c17cf195dff095d79e8?s=400&d=robohash&r=x',
    "featuredProductName" VARCHAR(200),
    "featuredProductId" VARCHAR(50),
    "password" VARCHAR(255) NOT NULL,
    "lang" TEXT NOT NULL DEFAULT E'en',
    "googleId" TEXT,
    "facebookId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "notificationsEnabled" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_recovery__password_tokens" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_refresh_tokens" (
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expireAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_followers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "followerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_friendship" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "friendId" INTEGER NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_userId_unique" ON "user_settings"("userId");

-- AddForeignKey
ALTER TABLE "localized_hiring_types" ADD FOREIGN KEY ("refId") REFERENCES "hiring_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localized_disclaimers" ADD FOREIGN KEY ("refId") REFERENCES "disclaimers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localized_listing_types" ADD FOREIGN KEY ("refId") REFERENCES "listing_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_settings" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localized_price_types" ADD FOREIGN KEY ("refId") REFERENCES "price_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localized_currencies" ADD FOREIGN KEY ("refId") REFERENCES "currencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
