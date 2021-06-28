import normalizeEmail from '@/utils/Normalize-email';
import { Transform } from 'class-transformer';
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
  institution = 'institution',
}
export class RegisterUserDto {
  @IsNotEmpty() name: string;

  @Transform(({ value }) => normalizeEmail(value))
  @IsEmail()
  email: string;

  @IsNotEmpty() @MinLength(8) password: string;

  @IsNotEmpty() @IsBoolean() notificationsEnabled: boolean;

  @IsNotEmpty() @IsEnum(AccountTypeEnum) type: AccountTypeEnum;

  @IsNotEmpty() @IsEnum(langEnum) lang: langEnum;
}
