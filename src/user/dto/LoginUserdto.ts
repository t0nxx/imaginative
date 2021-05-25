import { IsEmail, IsNotEmpty } from 'class-validator';

export default interface LoginUserDto {
  email: string;
  password: string;
}
