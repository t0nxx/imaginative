import { IsNotEmpty } from 'class-validator';

export class SocialLoginDto {
  @IsNotEmpty() token: string;
}

export enum AccountTypeProviderEnum {
  local = 'local',
  facebook = 'facebook',
  google = 'google',
  apple = 'apple',
}
