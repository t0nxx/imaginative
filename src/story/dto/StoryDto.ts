export default interface StoryDto {
  id: string;
  type: string;
  headerImage: any;
  headerLine: string;
  intro: string;
  body: string;
  conclusion: string;
  introImages: string;
  bodyImages: string;
  conclusionImages: string;
  otherImaginativeYear: string;
  tagline: string;
  info: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  productViewCount: number;
  ///// fields related to with relation ids i.e need to get its names in response
  privacyId: number;
  privacyName: string;

  disclaimerId: string;
  disclaimerName: string;

  imaginativeYearId: number;
  imaginativeYearName: string;

  listingId: string;
  listing: any;

  owner: any;

  createdAt: Date;
  updatedAt: Date;
}
