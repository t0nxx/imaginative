import normalizeEmail from '@/utils/Normalize-email';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class ResetPasswordDto {
  @IsNotEmpty()
  // in production . its parse (e) as the value itself not e.value
  @Transform((e) => normalizeEmail(typeof e != 'string' ? e.value : e))
  @IsEmail()
  email: string;

  @IsNotEmpty() token: string;

  @IsNotEmpty() @MinLength(8) newPassword: string;
}
