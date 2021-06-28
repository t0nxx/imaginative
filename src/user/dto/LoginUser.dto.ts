import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import normalizeEmail from '@/utils/Normalize-email';

export default class LoginUserDto {
  @IsNotEmpty()
  // in production . its parse (e) as the value itself not e.value
  @Transform((e) => normalizeEmail(typeof e != 'string' ? e.value : e))
  @IsEmail()
  email: string;

  @IsNotEmpty() @MinLength(8) password: string;
}
