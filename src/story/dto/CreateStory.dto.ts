import { MediaDto } from '@/shared/dto/Media.dto';
import { PrivacyDto } from '@/shared/dto/Privacy.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

export default class CreateStoryDto {
  @IsOptional() @IsNumber() @Min(1) listingId?: number;
  @IsNotEmpty() @IsNumber() @Min(1) disclaimerId: number;
  @IsNotEmpty() @IsNumber() imaginativeYear: number;
  @IsNotEmpty() @IsNumber() status: number;
  @IsNotEmpty() headerLine: string;
  @IsNotEmpty() intro: string;
  @IsNotEmpty() body: string;
  @IsNotEmpty() tagline: string;
  @IsNotEmpty() conclusion: string;

  @IsNotEmpty() @IsEnum(PrivacyDto) privacy: PrivacyDto;

  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  @Type(() => MediaDto)
  media: MediaDto[];
}
