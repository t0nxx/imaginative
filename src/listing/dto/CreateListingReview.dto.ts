import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export default class CreateListingReviewDto {
  @IsNotEmpty()
  reviewText: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  starRating: number;
}
