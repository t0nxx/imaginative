import { IsNotEmpty } from 'class-validator';

export default class UserDto {
  id: string;
  @IsNotEmpty()
  name: string;
  type: string;
  photoUrl?: string;
  featuredProductName?: string;
  featuredProductId?: string;
  followersCount: number;
  storiesCount: number;
  productsCount: number;
}
