export default interface ListingReviewDto {
  id: string;
  userId: string;
  listingId: string;
  title: string;
  goodAboutListing: string;
  notGoodAboutListing: string;
  reviewText: string;
  starRating: number;
}
