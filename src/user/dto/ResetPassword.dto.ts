import normalizeEmail from '@/utils/Normalize-email';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class ResetPasswordDto {
  @Transform(({ value }) => normalizeEmail(value))
  @IsEmail()
  email: string;

  @IsNotEmpty() token: string;

  @IsNotEmpty() @MinLength(8) newPassword: string;
}
