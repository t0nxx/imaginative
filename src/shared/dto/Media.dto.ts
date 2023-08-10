import { IsNotEmpty } from 'class-validator';

export class MediaDto {
  @IsNotEmpty() key?: string;

  @IsNotEmpty() url?: string;

  @IsNotEmpty() type?: string;
}
