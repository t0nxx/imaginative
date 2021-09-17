import { ListingTypesEnum } from '@/shared/constants';
import { User } from '@/user/user.decorator';
import { Controller, Get, Headers, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags /*,ApiOperation, ApiResponse, ApiBody*/,
} from '@nestjs/swagger';
import { I18nLang } from 'nestjs-i18n';
import CurrencyDto from './dto/CurrencyDto';
import DisclaimerDto from './dto/DisclaimerDto';
import HiringTypeDto from './dto/HiringTypeDto';
import ListingTypeDto from './dto/ListingTypeDto';
import PriceTypeDto from './dto/PriceTypeDto';
import { LookupsService } from './lookups.service';

@ApiTags('Lookups')
@Controller('v1/lookups')
export class LookupsController {
  constructor(private readonly lookupsService: LookupsService) {}

  @ApiOperation({ summary: 'Gets listing types' })
  @ApiParam({ name: 'type', enum: ListingTypesEnum })
  @Get('/listing-types/:type')
  async getListingTypes(
    @Param('type') type: ListingTypesEnum.Skill,
    @I18nLang() lang: string,
  ) {
    return await this.lookupsService.getListingTypes(type, lang);
  }

  @ApiOperation({ summary: 'Gets price types' })
  @Get('/price-types')
  async getPriceTypes(@I18nLang() lang: string) {
    return await this.lookupsService.getPriceTypes(lang);
  }

  @ApiOperation({ summary: 'Gets currencies' })
  @Get('/currencies')
  async getCurrencies(@I18nLang() lang: string) {
    return await this.lookupsService.getCurrencies(lang);
  }

  @ApiOperation({ summary: 'Gets hiring types' })
  @Get('/hiring-types')
  async getHiringTypes(@I18nLang() lang: string) {
    return await this.lookupsService.getHiringTypes(lang);
  }

  @ApiOperation({ summary: 'Gets page types' })
  @Get('/page-types')
  async getPageType(@I18nLang() lang: string) {
    return await this.lookupsService.getPageType(lang);
  }

  @ApiOperation({ summary: 'Gets uses types' })
  @Get('/uses-types')
  async getUsesTypes(@I18nLang() lang: string) {
    return await this.lookupsService.getUsesTypes(lang);
  }

  @ApiOperation({ summary: 'Gets brand types' })
  @Get('/brand-types')
  async getBrandType(@I18nLang() lang: string) {
    return await this.lookupsService.getBrandType(lang);
  }

  @ApiOperation({ summary: 'Gets StockAvailability' })
  @Get('/stockAvailability')
  async getStockAvailability(@I18nLang() lang: string) {
    return await this.lookupsService.getStockAvailability(lang);
  }

  @ApiOperation({ summary: 'Gets Disclaimer options' })
  @Get('/disclaimers')
  async getDisclaimers(@I18nLang() lang: string) {
    return await this.lookupsService.getDisclaimers(lang);
  }
  @ApiOperation({ summary: 'Gets Imaginative Years' })
  @Get('/imaginative-years')
  async getImaginativeYears() {
    return await this.lookupsService.getImaginativeYears();
  }
  @ApiOperation({ summary: 'Gets Privacy ' })
  @Get('/privacy')
  async getPrivacy(@I18nLang() lang: string) {
    return await this.lookupsService.getPrivacy(lang);
  }
}
