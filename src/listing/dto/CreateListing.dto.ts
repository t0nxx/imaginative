import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  Min,
} from 'class-validator';

export default class CreateListingDto {
  @IsNotEmpty() name: string;
  @IsNotEmpty() brandName: string;
  @IsNotEmpty() description: string;
  @IsNotEmpty() credentials: string;
  @IsNotEmpty() advantages: string;
  @IsNotEmpty() uses: string;
  @IsNotEmpty() @IsUrl() url: string;
  @IsOptional()
  @Transform((e) => (e ? e : []))
  media: string[];
  @IsNotEmpty()
  @Transform((e) => (e ? e : []))
  socialLinks: string[];
  //// optional fields depend on select other option in dropdowns
  @IsOptional() price?: string;
  @IsOptional() offerPrice?: string;
  @IsOptional() offerDescription?: string;
  @IsOptional() otherStockAvailability?: string;

  /// removed from fornt end view
  // @IsOptional() otherPriceType?: string;
  // @IsOptional() otherHiring?: string;
  //// drop down ids
  @IsOptional() @IsNumber() @Min(1) stockAvailabilityId?: number;
  @IsOptional() @IsNumber() @Min(1) pageTypeId?: number;
  @IsOptional() @IsNumber() @Min(1) privacyId?: number;
  @IsOptional() @IsNumber() @Min(1) listingTypeId?: number;
  @IsOptional() @IsNumber() @Min(1) currencyId?: number;
  @IsOptional() @IsNumber() @Min(1) hiringTypeId?: number;
  @IsOptional() @IsNumber() @Min(1) priceTypeId?: number;
  @IsOptional() @IsNumber() @Min(1) brandTypeId?: number;
  @IsOptional() @IsNumber() @Min(1) usesTypeId?: number;
}
