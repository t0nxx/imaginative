import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { currencies, localizedCurrencies } from './seed-data/currencies';
import { disclaimers, localizedDisclaimers } from './seed-data/disclaimers';
import { hiringTypes, localizedHiringTypes } from './seed-data/hiring-types';
import { listingTypes, localizedListingTypes } from './seed-data/listing-types';
import { priceTypes, localizedPriceTypes } from './seed-data/price-types';

async function main() {
  for (const item of currencies) {
    const { id, ...rest } = item;
    await prisma.currencies.create({
      data: rest,
    });
  }
  for (const item of localizedCurrencies) {
    const { id, ...rest } = item;
    await prisma.localizedCurrencies.create({
      data: rest,
    });
  }
  ///////////////////////////////////////////////////////////
  for (const item of disclaimers) {
    const { id, ...rest } = item;
    await prisma.disclaimers.create({
      data: rest,
    });
  }
  for (const item of localizedDisclaimers) {
    const { id, ...rest } = item;
    await prisma.localizedDisclaimers.create({
      data: rest,
    });
  }

  ///////////////////////////////////////////////////////////////
  for (const item of priceTypes) {
    const { id, ...rest } = item;
    await prisma.priceTypes.create({
      data: rest,
    });
  }
  for (const item of localizedPriceTypes) {
    const { id, ...rest } = item;
    await prisma.localizedPriceTypes.create({
      data: rest,
    });
  }

  ///////////////////////////////////////////////////////////////
  for (const item of hiringTypes) {
    const { id, ...rest } = item;
    await prisma.hiringTypes.create({
      data: rest,
    });
  }
  for (const item of localizedHiringTypes) {
    const { id, ...rest } = item;
    await prisma.localizedHiringTypes.create({
      data: rest,
    });
  }

  ///////////////////////////////////////////////////////////////
  for (const item of listingTypes) {
    const { id, ...rest } = item;
    await prisma.listingTypes.create({
      data: rest,
    });
  }
  for (const item of localizedListingTypes) {
    const { id, ...rest } = item;
    await prisma.localizedListingTypes.create({
      data: rest,
    });
  }

  ///////////////////////////////////////////////////////////////
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
