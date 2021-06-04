import { IsEmail } from 'class-validator';

export default class ForgetPasswordDto {
  @IsEmail() email: string;
}
