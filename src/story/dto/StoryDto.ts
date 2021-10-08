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
  status: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  productViewCount: number;
  ///// fields related to with relation ids i.e need to get its names in response

  privacy: any;

  disclaimer: any;

  imaginativeYear: any;

  listing: any;

  owner: any;

  createdAt: Date;
  updatedAt: Date;
}
