export default interface ListingReviewDto {
  id: number;
  ownerId: number;
  owner: any;
  reviewText: string;
  starRating: number;
  createdAt: Date;
  updatedAt: Date;
}
