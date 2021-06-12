export default interface CreateListingDto {
  ownerId: number;
  pageType: string;
  listingTypeId: number;
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
  priceTypeId: number;
  otherPriceType?: string;
  currencyId?: number;
  hiringTypeId?: number;
  otherHiring?: number;
  offerPrice: number;
  offerDescription: string;
  socialLinks: any;
  status: number;
}
