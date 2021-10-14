export default interface ListingDto {
  id: number;
  type: string; // type is listing or story , just identifer fro front end
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
  updatedFields: string[];
  status: number;
  ownerId: number;
  owner: any;
  //// optional strings
  offerPrice: number;
  offerDescription: string;
  otherStockAvailability: string;
  otherPriceType: string;
  otherHiring: string;
  /////////////////////////////////
  overallRating: string;
  totalRatingCount: number;
  viewsCount: number;
  followCount: number;
  storiesCount: number;
  shareCount: number;
  isEdited: boolean;
  isRepublished: boolean;
  isFollowed: boolean;
  createdAt: Date;
  updatedAt: Date;

  /// review summary
  reviewSummary: any;
  //// drop down ids object (came in run time)
  stockAvailability: any;

  pageType: any;

  privacy: any;

  listingType: any;

  currency: any;

  hiringType: any;

  priceType: any;

  brandType: any;

  usesType: any;
}
