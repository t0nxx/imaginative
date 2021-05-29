import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class LoginUserDto {
  @IsEmail() email: string;

  @IsNotEmpty() @MinLength(8) password: string;
}
