import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export default class ForgetPasswordDto {
  @Transform(({ value }) => value.trimStart().trimEnd())
  @IsEmail()
  email: string;
}
