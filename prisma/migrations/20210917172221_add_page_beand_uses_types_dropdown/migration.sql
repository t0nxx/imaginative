-- CreateTable
CREATE TABLE "pageType" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(128) NOT NULL,
    "withConditions" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localized_pageType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "refId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brandType" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(128) NOT NULL,
    "withConditions" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localized_BrandType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "refId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usesType" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(128) NOT NULL,
    "withConditions" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localized_UsesType" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "refId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stockAvailability" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(128) NOT NULL,
    "withConditions" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localized_StockAvailability" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "language" VARCHAR(10) NOT NULL,
    "refId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "localized_UsesType" ADD FOREIGN KEY ("refId") REFERENCES "usesType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localized_StockAvailability" ADD FOREIGN KEY ("refId") REFERENCES "stockAvailability"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localized_BrandType" ADD FOREIGN KEY ("refId") REFERENCES "brandType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "localized_pageType" ADD FOREIGN KEY ("refId") REFERENCES "pageType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
