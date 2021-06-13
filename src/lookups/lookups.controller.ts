import { User } from '@/user/user.decorator';
import { Controller, Get, Headers, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags /*,ApiOperation, ApiResponse, ApiBody*/,
} from '@nestjs/swagger';
import CurrencyDto from './dto/CurrencyDto';
import DisclaimerDto from './dto/DisclaimerDto';
import HiringTypeDto from './dto/HiringTypeDto';
import ListingTypeDto from './dto/ListingTypeDto';
import PriceTypeDto from './dto/PriceTypeDto';
import { LookupsService } from './lookups.service';

@ApiBearerAuth()
@ApiTags('Lookups')
@Controller()
export class LookupsController {
  constructor(private readonly lookupsService: LookupsService) {}

  @ApiOperation({ summary: 'Gets listing types' })
  @ApiResponse({ status: 200, description: 'Returns the listing types' })
  @Get('v1/lookups/listing-types/:type')
  async getListingTypes(
    @Param('type') type: string,
    @User('lang') lang: string,
  ): Promise<ListingTypeDto[]> {
    return await this.lookupsService.getListingTypes(type, lang);
  }

  @ApiOperation({ summary: 'Gets price types' })
  @ApiResponse({ status: 200, description: 'Returns the price types' })
  @Get('v1/lookups/price-types')
  async getPriceTypes(@User('lang') lang: string): Promise<PriceTypeDto[]> {
    return await this.lookupsService.getPriceTypes(lang);
  }

  @ApiOperation({ summary: 'Gets currencies' })
  @ApiResponse({ status: 200, description: 'Returns the currency list' })
  @Get('v1/lookups/currencies')
  async getCurrencies(@User('lang') lang: string): Promise<CurrencyDto[]> {
    return await this.lookupsService.getCurrencies(lang);
  }

  @ApiOperation({ summary: 'Gets hiring types' })
  @ApiResponse({ status: 200, description: 'Returns the hiring types' })
  @Get('v1/lookups/hiring-types')
  async getHiringTypes(@User('lang') lang: string): Promise<HiringTypeDto[]> {
    return await this.lookupsService.getHiringTypes(lang);
  }

  @ApiOperation({ summary: 'Gets Disclaimer options' })
  @ApiResponse({ status: 200, description: 'Returns the disclaimer options' })
  @Get('v1/lookups/disclaimers')
  async getDisclaimers(@User('lang') lang: string): Promise<DisclaimerDto[]> {
    return await this.lookupsService.getDisclaimers(lang);
  }
}
