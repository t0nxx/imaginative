import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { currencies, localizedCurrencies } from './seed-data/currencies';
import { disclaimers, localizedDisclaimers } from './seed-data/disclaimers';
import { hiringTypes, localizedHiringTypes } from './seed-data/hiring-types';
import { imaginativeYears } from './seed-data/imaginative-years';
import { listingTypes, localizedListingTypes } from './seed-data/listing-types';
import { priceTypes, localizedPriceTypes } from './seed-data/price-types';
import { localizedPrivacy, privacy } from './seed-data/privacy';
import { stories } from './seed-data/stories';
import { users } from './seed-data/users';
import { listings } from './seed-data/listings';
import { localizedPageTypes, pageTypes } from './seed-data/page-types';
import { localizedUsesTypes, usesTypes } from './seed-data/uses-types';
import { brandTypes, localizedBrandTypes } from './seed-data/brand-types';
import {
  localizedStockAvailability,
  stockAvailability,
} from './seed-data/stock-availability';

async function main() {
  /// seed currencies
  await prisma.localizedCurrencies.deleteMany({});
  await prisma.currencies.deleteMany({});

  await prisma.currencies.createMany({
    data: currencies,
  });

  /// seed localizedCurrencies
  await prisma.localizedCurrencies.createMany({
    data: localizedCurrencies,
  });
  ///////////////////////////////////////////////////////////
  /// seed disclaimers
  await prisma.localizedDisclaimers.deleteMany({});
  await prisma.disclaimers.deleteMany({});

  await prisma.disclaimers.createMany({
    data: disclaimers,
  });

  await prisma.localizedDisclaimers.createMany({
    data: localizedDisclaimers,
  });

  ///////////////////////////////////////////////////////////////
  await prisma.localizedPriceTypes.deleteMany({});
  await prisma.priceTypes.deleteMany({});

  await prisma.priceTypes.createMany({
    data: priceTypes,
  });

  await prisma.localizedPriceTypes.createMany({
    data: localizedPriceTypes,
  });

  ///////////////////////////////////////////////////////////////
  await prisma.localizedHiringTypes.deleteMany({});
  await prisma.hiringTypes.deleteMany({});

  await prisma.hiringTypes.createMany({
    data: hiringTypes,
  });

  await prisma.localizedHiringTypes.createMany({
    data: localizedHiringTypes,
  });

  ///////////////////////////////////////////////////////////////
  await prisma.localizedListingTypes.deleteMany({});
  await prisma.listingTypes.deleteMany({});

  await prisma.listingTypes.createMany({
    data: listingTypes,
  });

  await prisma.localizedListingTypes.createMany({
    data: localizedListingTypes,
  });

  ///////////////////////////////////////////////////////////////
  await prisma.imaginativeYears.deleteMany({});

  await prisma.imaginativeYears.createMany({
    data: imaginativeYears,
  });

  ///////////////////////////////////////////////////////////////
  await prisma.localizedPrivacy.deleteMany({});
  await prisma.privacy.deleteMany({});

  await prisma.privacy.createMany({
    data: privacy,
  });

  await prisma.localizedPrivacy.createMany({
    data: localizedPrivacy,
  });

  ///////////////////////////////////////////////////////////////
  await prisma.localizedStockAvailability.deleteMany({});
  await prisma.stockAvailability.deleteMany({});

  await prisma.stockAvailability.createMany({
    data: stockAvailability,
  });

  await prisma.localizedStockAvailability.createMany({
    data: localizedStockAvailability,
  });

  ///////////////////////////////////////////////////////////////
  await prisma.localizedBrandType.deleteMany({});
  await prisma.brandType.deleteMany({});

  await prisma.brandType.createMany({
    data: brandTypes,
  });

  await prisma.localizedBrandType.createMany({
    data: localizedBrandTypes,
  });

  ///////////////////////////////////////////////////////////////
  await prisma.localizedUsesType.deleteMany({});
  await prisma.usesType.deleteMany({});

  await prisma.usesType.createMany({
    data: usesTypes,
  });

  await prisma.localizedUsesType.createMany({
    data: localizedUsesTypes,
  });

  ///////////////////////////////////////////////////////////////
  await prisma.localizedPageType.deleteMany({});
  await prisma.pageType.deleteMany({});

  await prisma.pageType.createMany({
    data: pageTypes,
  });

  await prisma.localizedPageType.createMany({
    data: localizedPageTypes,
  });

  ///////////////////////////////////////////////////////////////

  // await prisma.user.createMany({
  //   data: users,
  // });

  ///////////////////////////////////////////////////////////////

  // await prisma.story.createMany({
  //   data: stories,
  // });

  ///////////////////////////////////////////////////////////////

  // await prisma.listings.createMany({
  //   data: listings,
  // });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
