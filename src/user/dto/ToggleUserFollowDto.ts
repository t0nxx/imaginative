import { IsBoolean, IsNotEmpty } from 'class-validator';

export default class ToggleUserFollowDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  followerId: string;

  @IsBoolean()
  isFollowed: boolean;
}
