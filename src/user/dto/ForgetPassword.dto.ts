import normalizeEmail from '@/utils/Normalize-email';
import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export default class ForgetPasswordDto {
  @Transform(({ value }) => normalizeEmail(value))
  @IsEmail()
  email: string;
}
