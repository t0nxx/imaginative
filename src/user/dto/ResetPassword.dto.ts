import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class ResetPasswordDto {
  @Transform(({ value }) => value.trimEnd())
  @IsEmail()
  email: string;

  @IsNotEmpty() token: string;

  @IsNotEmpty() @MinLength(8) newPassword: string;
}
