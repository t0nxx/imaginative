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

export enum AccountTypeEnum {
  individual = 'individual',
  company = 'company',
  institute = 'institute',
}
export class RegisterUserDto {
  @IsNotEmpty() name: string;

  @IsEmail() email: string;

  @IsNotEmpty() @MinLength(8) password: string;

  @IsNotEmpty() @IsBoolean() notificationsEnabled: boolean;

  @IsNotEmpty() @IsEnum(AccountTypeEnum) type: AccountTypeEnum;

  @IsNotEmpty() @IsEnum(langEnum) lang: langEnum;
}
