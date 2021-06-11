import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { currencies, localizedCurrencies } from './seed-data/currencies';
import { disclaimers, localizedDisclaimers } from './seed-data/disclaimers';
import { hiringTypes, localizedHiringTypes } from './seed-data/hiring-types';
import { listingTypes, localizedListingTypes } from './seed-data/listing-types';
import { listings } from './seed-data/listings';
import { priceTypes, localizedPriceTypes } from './seed-data/price-types';
import { stories } from './seed-data/stories';
import { users } from './seed-data/users';

async function main() {
  /// seed currencies
  await prisma.currencies.createMany({
    data: currencies,
  });

  /// seed localizedCurrencies
  await prisma.localizedCurrencies.createMany({
    data: localizedCurrencies,
  });
  ///////////////////////////////////////////////////////////
  /// seed disclaimers

  await prisma.disclaimers.createMany({
    data: disclaimers,
  });

  await prisma.localizedDisclaimers.createMany({
    data: localizedDisclaimers,
  });

  ///////////////////////////////////////////////////////////////

  await prisma.priceTypes.createMany({
    data: priceTypes,
  });

  await prisma.localizedPriceTypes.createMany({
    data: localizedPriceTypes,
  });

  ///////////////////////////////////////////////////////////////

  await prisma.hiringTypes.createMany({
    data: hiringTypes,
  });

  await prisma.localizedHiringTypes.createMany({
    data: localizedHiringTypes,
  });

  ///////////////////////////////////////////////////////////////

  await prisma.listingTypes.createMany({
    data: listingTypes,
  });

  await prisma.localizedListingTypes.createMany({
    data: localizedListingTypes,
  });

  ///////////////////////////////////////////////////////////////

  await prisma.user.createMany({
    data: users,
  });

  ///////////////////////////////////////////////////////////////

  await prisma.story.createMany({
    data: stories,
  });

  ///////////////////////////////////////////////////////////////

  await prisma.listings.createMany({
    data: listings,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
