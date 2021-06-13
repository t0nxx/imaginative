import { Injectable } from '@nestjs/common';
import ListingTypeDto from './dto/ListingTypeDto';
import PriceTypeDto from './dto/PriceTypeDto';
import CurrencyDto from './dto/CurrencyDto';
import { AppCache } from '@/shared/core/Cache';
import HiringTypeDto from './dto/HiringTypeDto';
import DisclaimerDto from './dto/DisclaimerDto';
import { v4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import env from '@/shared/core/Environment';
import { PrismaService } from '@/shared/core/prisma.service';

const rootDir = env.UPLOAD_ROOT_DIR;

@Injectable()
export class LookupsService {
  constructor(private readonly db: PrismaService) {}

  public async getListingTypes(
    category: string,
    lang: string,
  ): Promise<ListingTypeDto[]> {
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
    return data;
  }

  public async getAllListingTypes(lang: string): Promise<ListingTypeDto[]> {
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
    return data;
  }

  public async getPriceTypes(lang: string): Promise<PriceTypeDto[]> {
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
    return data;
  }

  public async getCurrencies(lang: string): Promise<CurrencyDto[]> {
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
    return data;
  }

  public async getHiringTypes(lang: string): Promise<HiringTypeDto[]> {
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
    return data;
  }

  public async getDisclaimers(lang: string): Promise<DisclaimerDto[]> {
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
        console.log(result);
        return result;
      },
    );
    return data;
  }

  public saveFile(
    bucket: string,
    type: string,
    fileName: string,
    fileContent: any,
  ): any {
    const bucketDir = path.join(rootDir, bucket);
    if (!fs.existsSync(bucketDir)) {
      fs.mkdirSync(bucketDir);
    }
    const fileTypeDir = path.join(rootDir, bucket, type);
    if (!fs.existsSync(fileTypeDir)) {
      fs.mkdirSync(fileTypeDir);
    }
    fs.writeFile(path.join(fileTypeDir, fileName), fileContent, (err) => {
      console.log(err);
    });
    return {
      bucket: bucket,
      type: type,
      fileName: fileName,
    };
  }

  public getFile(bucket: string, type: string, fileName: string): any {
    const filePath = path.join(rootDir, bucket, type, fileName);
    if (!fs.existsSync(filePath)) return null;
    return filePath;
  }

  public duplicateFile(bucket: string, type: string, fileName: string): any {
    const filePath = path.join(rootDir, bucket, type, fileName);
    if (!fs.existsSync(filePath)) return null;
    const newFileName = `${v4()}${path.extname(filePath)}`;
    fs.copyFileSync(
      filePath,
      `${path.join(rootDir, bucket, type, newFileName)}`,
    );
    return newFileName;
  }

  public deleteFile(bucket: string, type: string, fileName: string): boolean {
    try {
      const filePath = path.join(rootDir, bucket, type, fileName);
      if (!fs.existsSync(filePath)) return false;
      fs.unlinkSync(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}
