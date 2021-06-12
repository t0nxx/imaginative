export default interface ListingReviewDto {
  id: number;
  userId: number;
  listingId: number;
  title: string;
  goodAboutListing: string;
  notGoodAboutListing: string;
  reviewText: string;
  starRating: number;
}
