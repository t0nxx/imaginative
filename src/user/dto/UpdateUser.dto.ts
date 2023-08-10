import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { RegisterUserDto } from './RegisterUser.dto';

export class UpdateUserDto extends PartialType(RegisterUserDto) {
  //   @IsOptional()
  //   birthdate: string;
  @IsOptional()
  oldPassword: string;
}
