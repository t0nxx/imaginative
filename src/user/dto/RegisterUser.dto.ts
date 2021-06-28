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

  @IsNotEmpty()
  // in production . its parse (e) as the value itself not e.value
  @Transform((e) => normalizeEmail(typeof e != 'string' ? e.value : e))
  @IsEmail()
  email: string;

  @IsNotEmpty() @MinLength(8) password: string;

  @IsNotEmpty() @IsBoolean() notificationsEnabled: boolean;

  @IsNotEmpty() @IsEnum(AccountTypeEnum) type: AccountTypeEnum;

  @IsNotEmpty() @IsEnum(langEnum) lang: langEnum;
}
