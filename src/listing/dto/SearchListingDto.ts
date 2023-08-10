export default class SearchListingDto {
  ownerId?: string;
  pageType?: string;
  listingTypeId?: string;
  freeText?: string;
  status?: number = undefined;
  pageIndex?: number;
  pageSize?: number;
  followerId?: string;
}
