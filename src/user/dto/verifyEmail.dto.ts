import normalizeEmail from '@/utils/Normalize-email';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export default class VerifyEmailDto {
  @IsNotEmpty()
  // in production . its parse (e) as the value itself not e.value
  @Transform((e) => normalizeEmail(typeof e != 'string' ? e.value : e))
  @IsEmail({}, { message: 'please enter valid email ' })
  email: string;

  @IsNotEmpty() code: string;

  /// could add password also for returnig user object direclty , to redirect user to home page after verification withou re login again
  @IsNotEmpty() password: string;
}
