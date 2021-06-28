import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import normalizeEmail from '@/utils/Normalize-email';

export default class LoginUserDto {
  @Transform(({ value }) => normalizeEmail(value))
  @IsEmail()
  email: string;

  @IsNotEmpty() @MinLength(8) password: string;
}
