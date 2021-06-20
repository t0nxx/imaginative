import { IsNotEmpty, IsOptional } from 'class-validator';

export class NotificationTokenDto {
  @IsNotEmpty() token: string;

  @IsOptional() userId: number;
}
