import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export default class LoginUserDto {
  @Transform(({ value }) => value.trimEnd())
  @IsEmail()
  email: string;

  @IsNotEmpty() @MinLength(8) password: string;
}
