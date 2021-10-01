export default class CreateListingDto {
  name: string;
  brandName: string;
  description: string;
  credentials: string;
  advantages: string;
  uses: string;
  url: string;
  price: number;
  media: string[];
  socialLinks: string[];
  //// optional fields depend on select other option in dropdowns
  offerPrice?: number;
  offerDescription?: string;
  otherStockAvailability?: string;
  otherPriceType?: string;
  otherHiring?: string;
  //// drop down ids
  stockAvailabilityId?: number;
  pageTypeId?: number;
  privacyId?: number;
  listingTypeId?: number;
  currencyId?: number;
  hiringTypeId?: number;
  priceTypeId?: number;
}
