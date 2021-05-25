export default interface CreateListingDto {
  id: string;
  ownerId: string;
  pageType: string;
  listingTypeId: string;
  privacy: string;
  media: any;
  name: string;
  brandName: string;
  description: string;
  credentials: string;
  uses: string;
  stockAvailability: string;
  advantages: string;
  url: string;
  price: number;
  priceTypeId: string;
  otherPriceType?: string;
  currencyId?: string;
  hiringTypeId?: string;
  otherHiring?: string;
  offerPrice: number;
  offerDescription: string;
  socialLinks: any;
  viewsCount: number;
  status: number;
  isEdited: boolean;

  overallRating: number;
  totalRatingCount: number;
}
