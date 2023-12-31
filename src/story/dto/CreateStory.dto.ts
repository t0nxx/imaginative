import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export default class CreateStoryDto {
  @IsNotEmpty() headerImage: string;
  @IsNotEmpty() headerLine: string;
  @IsNotEmpty() @IsNumber() @Min(1) privacyId: number;
  @IsNotEmpty() @IsNumber() @Min(1) disclaimerId: number;
  @IsNotEmpty() @IsNumber() @Min(1) imaginativeYearId: number;
  @IsOptional() @IsNumber() @Min(1) listingId?: number;

  @IsNotEmpty() intro: string;
  @IsNotEmpty() body: string;
  @IsNotEmpty() conclusion: string;

  /// optional if user choose other manully typed in the imaginativeYear drop list
  @IsOptional() otherImaginativeYear: string;

  /// optional if user want to upload image with each section
  /// cause the front end send null not [] in case no items , i should map the props to empty array in case the request body is null
  @IsOptional()
  @Transform((e) => (e ? e : []))
  introImages: string[];
  @IsOptional()
  @Transform((e) => (e ? e : []))
  bodyImages: string[];
  @IsOptional()
  @Transform((e) => (e ? e : []))
  conclusionImages: string[];

  /// this is optional since it will be sent only if story of type product based on (disclaimerId) is promote product
  @IsOptional() tagline: string;
  @IsOptional() info: string;
}
