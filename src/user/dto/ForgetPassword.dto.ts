import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export default class ForgetPasswordDto {
  @Transform(({ value }) => value.trimEnd())
  @IsEmail()
  email: string;
}
