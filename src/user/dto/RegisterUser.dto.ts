import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export enum langEnum {
  en = 'en',
  ar = 'ar',
}
export class RegisterUserDto {
  @IsNotEmpty() name: string;

  @IsEmail() email: string;

  @IsNotEmpty() @MinLength(8) password: string;

  @IsNotEmpty() @IsBoolean() notificationsEnabled: boolean;

  @IsOptional() @IsEnum(langEnum) lang: langEnum;
}
