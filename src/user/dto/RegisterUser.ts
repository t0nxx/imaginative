import { IsEmail, IsNotEmpty } from 'class-validator';

export default class RegisterUser {
  id: string;
  @IsNotEmpty()
  name: string;
  @IsEmail()
  email: string;
  password: string;
  notificationsEnabled: boolean;
  hash: string;
}
