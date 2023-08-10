export default class SearchStoryDto {
  ownerId?: string;
  listingId?: string;
  status?: number = undefined;
  pageIndex?: number;
  pageSize?: number;
}
