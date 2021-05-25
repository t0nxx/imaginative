import { IsEmail, IsNotEmpty } from 'class-validator';

export default class LoginUserDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
