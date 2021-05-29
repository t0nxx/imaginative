import { IsBoolean, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class RegisterUserDto {
  @IsNotEmpty() name: string;

  @IsEmail() email: string;

  @IsNotEmpty() @MinLength(8) password: string;

  @IsNotEmpty() @IsBoolean() notificationsEnabled: boolean;
}
