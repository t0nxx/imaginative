import { MediaDto } from '@/shared/dto/Media.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
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
  @IsNotEmpty() privacy: string;
  @IsNotEmpty() headerLine: string;
  @IsNotEmpty() intro: string;
  @IsNotEmpty() body: string;
  @IsNotEmpty() tagline: string;
  @IsNotEmpty() conclusion: string;

  @ValidateNested({ each: true })
  @IsArray()
  @IsNotEmpty()
  @Type(() => MediaDto)
  media: MediaDto[];
}
