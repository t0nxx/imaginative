import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class ResetPasswordDto {
  @IsEmail() email: string;

  @IsNotEmpty() token: string;

  @IsNotEmpty() @MinLength(8) newPassword: string;
}
