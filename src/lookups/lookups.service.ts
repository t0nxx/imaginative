import { Injectable } from '@nestjs/common';
import ListingTypeDto from './dto/ListingTypeDto';
import PriceTypeDto from './dto/PriceTypeDto';
import CurrencyDto from './dto/CurrencyDto';
import { AppCache } from '@/shared/core/Cache';
import HiringTypeDto from './dto/HiringTypeDto';
import DisclaimerDto from './dto/DisclaimerDto';
import { PrismaService } from '@/shared/core/prisma.service';
import OperationResult from '@/shared/models/OperationResult';
import ImaginativeYearsDto from './dto/ImaginativeYearsDto';
import PrivacyDto from './dto/PrivacyDto';

@Injectable()
export class LookupsService {
  constructor(private readonly db: PrismaService) {}

  public async getListingTypes(category: string, lang: string) {
    const data = await AppCache.getAsync(
      `__listingTypes_${category}_${lang}__`,
      60 * 120,
      async () => {
        const result = new Array<ListingTypeDto>();
        const listingTypes = await this.db.listingTypes.findMany({
          where: {
            category: category,
          },
        });

        const localizedListingTypes =
          await this.db.localizedListingTypes.findMany({
            where: {
              language: lang,
            },
          });

        for (const listingType of listingTypes) {
          const type = {
            id: listingType.id,
            code: listingType.code,
            createdAt: listingType.createdAt,
            updatedAt: listingType.updatedAt,
            name: '',
          };
          const localizedListingType = localizedListingTypes.find(
            (llt) => llt.refId === listingType.id,
          );
          if (localizedListingType) {
            type.name = localizedListingType.name;
          }
          result.push(type);
        }
        return result;
      },
    );
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    res.data = data;
    return res;
  }

  public async getAllListingTypes(lang: string) {
    const data = await AppCache.getAsync(
      `__listingTypes_${lang}__`,
      60 * 120,
      async () => {
        const result = new Array<ListingTypeDto>();
        const listingTypes = await this.db.listingTypes.findMany();

        const localizedListingTypes =
          await this.db.localizedListingTypes.findMany({
            where: {
              language: lang,
            },
          });

        for (const listingType of listingTypes) {
          const type = {
            id: listingType.id,
            code: listingType.code,
            createdAt: listingType.createdAt,
            updatedAt: listingType.updatedAt,
            name: '',
          };
          const localizedListingType = localizedListingTypes.find(
            (llt) => llt.refId === listingType.id,
          );
          if (localizedListingType) {
            type.name = localizedListingType.name;
          }
          result.push(type);
        }
        return result;
      },
    );
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    res.data = data;
    return res;
  }

  public async getPriceTypes(lang: string) {
    const data = await AppCache.getAsync(
      `__priceTypes_${lang}__`,
      60 * 120,
      async () => {
        const result = new Array<PriceTypeDto>();
        const priceTypes = await this.db.priceTypes.findMany();

        const localizedPriceTypes = await this.db.localizedPriceTypes.findMany({
          where: {
            language: lang,
          },
        });

        for (const priceType of priceTypes) {
          const type = {
            id: priceType.id,
            code: priceType.code,
            createdAt: priceType.createdAt,
            updatedAt: priceType.updatedAt,
            name: '',
            format: '',
          };
          const localizedPriceType = localizedPriceTypes.find(
            (lpt) => lpt.refId === priceType.id,
          );
          if (localizedPriceType) {
            type.name = localizedPriceType.name;
            type.format = localizedPriceType.format;
          }
          result.push(type);
        }
        return result;
      },
    );
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    res.data = data;
    return res;
  }

  public async getCurrencies(lang: string) {
    const data = await AppCache.getAsync(
      `__currencies_${lang}__`,
      60 * 120,
      async () => {
        const result = new Array<CurrencyDto>();
        const currencies = await this.db.currencies.findMany();

        const localizedCurrencies = await this.db.localizedCurrencies.findMany({
          where: {
            language: lang,
          },
        });

        for (const localizedCurrency of localizedCurrencies) {
          const currency = currencies.find(
            (c) => c.id === localizedCurrency.refId,
          );
          if (currency) {
            const type = {
              id: currency.id,
              createdAt: currency.createdAt,
              updatedAt: currency.updatedAt,
              code: currency.code,
              symbol: currency.symbol,
              name: localizedCurrency.name,
              standardCode: localizedCurrency.standardCode,
            };
            type.name = localizedCurrency.name;
            type.standardCode = localizedCurrency.standardCode;
            result.push(type);
          }
        }
        return result;
      },
    );
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    res.data = data;
    return res;
  }

  public async getHiringTypes(lang: string) {
    const data = await AppCache.getAsync(
      `__hiringTypes_${lang}__`,
      60 * 120,
      async () => {
        const result = new Array<HiringTypeDto>();
        const hiringTypes = await this.db.hiringTypes.findMany();

        const localizedHiringTypes =
          await this.db.localizedHiringTypes.findMany({
            where: {
              language: lang,
            },
          });

        for (const hiringType of hiringTypes) {
          const type = {
            id: hiringType.id,
            code: hiringType.code,
            createdAt: hiringType.createdAt,
            updatedAt: hiringType.updatedAt,
            name: '',
          };
          const localizedHiringType = localizedHiringTypes.find(
            (lpt) => lpt.refId === hiringType.id,
          );
          if (localizedHiringType) {
            type.name = localizedHiringType.name;
          }
          result.push(type);
        }
        return result;
      },
    );
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    res.data = data;
    return res;
  }

  public async getDisclaimers(lang: string) {
    const data = await AppCache.getAsync(
      `__disclaimers_${lang}__`,
      60 * 120,
      async () => {
        const result = new Array<DisclaimerDto>();
        const disclaimers = await this.db.disclaimers.findMany({});

        const localizedDisclaimers =
          await this.db.localizedDisclaimers.findMany({
            where: {
              language: lang,
            },
          });

        for (const disclaimer of disclaimers) {
          const type = {
            id: disclaimer.id,
            code: disclaimer.code,
            createdAt: disclaimer.createdAt,
            updatedAt: disclaimer.updatedAt,
            name: '',
          };
          const localizedDisclaimer = localizedDisclaimers.find(
            (lpt) => lpt.refId === disclaimer.id,
          );
          if (localizedDisclaimer) {
            type.name = localizedDisclaimer.name;
          }
          result.push(type);
        }
        return result;
      },
    );
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    res.data = data;
    return res;
  }
  public async getImaginativeYears() {
    const data = await AppCache.getAsync(
      `__ImaginativeYears`,
      60 * 120,
      async () => {
        const result = await this.db.imaginativeYears.findMany({});
        return result;
      },
    );
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    res.data = data;
    return res;
  }
  public async getPrivacy(lang: string) {
    const data = await AppCache.getAsync(
      `__Privacy_${lang}__`,
      60 * 120,
      async () => {
        const result = new Array<PrivacyDto>();
        const privacy = await this.db.privacy.findMany({});

        const localizedPrivacy = await this.db.localizedPrivacy.findMany({
          where: {
            language: lang,
          },
        });

        for (const p of privacy) {
          const type = {
            id: p.id,
            code: p.code,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            name: '',
          };
          const localizedpriv = localizedPrivacy.find(
            (lpt) => lpt.refId === p.id,
          );
          if (localizedpriv) {
            type.name = localizedpriv.name;
          }
          result.push(type);
        }
        return result;
      },
    );
    const res = new OperationResult();
    res.message[0] = 'successfully temp message';
    res.data = data;
    return res;
  }
}
