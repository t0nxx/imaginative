export default interface StoryDto {
  id: string;
  type: string;
  headerImage: any;
  headerLine: string;
  intro: string;
  body: string;
  conclusion: string;
  introImage: string;
  bodyImage: string;
  conclusionImage: string;
  otherImaginativeYear: string;
  tagline: string;
  info: string;
  updatedFields: any;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isRepublished: boolean;
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
