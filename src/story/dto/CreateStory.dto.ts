import { PrivacyDto } from '@/shared/dto/Privacy.dto';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export default class CreateStoryDto {
  @IsNotEmpty() @IsEnum(PrivacyDto) privacy: PrivacyDto;
  @IsNotEmpty() @IsNumber() @Min(1) headerImage: number; /// id of uploaded file
  @IsNotEmpty() headerLine: string;
  @IsNotEmpty() @IsNumber() @Min(1) disclaimerId: number;
  @IsNotEmpty() @IsNumber() @Min(1) imaginativeYear: number;
  @IsOptional() @IsNumber() @Min(1) listingId?: number;

  @IsNotEmpty() intro: string;
  @IsNotEmpty() body: string;
  @IsNotEmpty() conclusion: string;

  /// optional if user choose other manully typed in the imaginativeYear drop list
  @IsOptional() otherImaginativeYear: string;

  /// this is optional since it will be sent only if story of type product based on (disclaimerId) is promote product
  @IsOptional() tagline: string;
  @IsOptional() info: string;

  @IsArray()
  media: number[];
}
