import { IsEmail, IsNotEmpty } from 'class-validator';

export default class VerifyEmailDto {
  @IsEmail() email: string;
  @IsNotEmpty() code: string;

  /// could add password also for returnig user object direclty , to redirect user to home page after verification withou re login again
  @IsNotEmpty() password: string;
}
