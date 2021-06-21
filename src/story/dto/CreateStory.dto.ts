import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export default class CreateStoryDto {
  @IsOptional() @IsNumber() listingId?: number;
  @IsNotEmpty() @IsNumber() disclaimerId: number;
  @IsNotEmpty() @IsNumber() imaginativeYear: number;
  @IsNotEmpty() @IsNumber() status: number;
  @IsNotEmpty() privacy: string;
  @IsNotEmpty() headerLine: string;
  @IsNotEmpty() intro: string;
  @IsNotEmpty() body: string;
  @IsNotEmpty() tagline: string;
  @IsNotEmpty() conclusion: string;
  @IsNotEmpty() media: any;
}
