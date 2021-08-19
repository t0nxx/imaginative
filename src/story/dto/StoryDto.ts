export default interface StoryDto {
  id: string;
  type: string;
  privacy: string;
  headerImage: any;
  headerLine: string;
  intro: string;
  body: string;
  conclusion: string;
  imaginativeYear: number;
  otherImaginativeYear: string;
  tagline: string;
  info: string;
  media: any;
  owner: any;
  disclaimerId: string;
  disclaimerName: string;
  listingId: string;
  listing: any;
  updatedFields: any;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isRepublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}
