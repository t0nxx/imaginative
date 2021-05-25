export default interface StoryDto {
  id: string;
  type: string;
  owner: any;
  listingId?: string;
  listing?: any;
  privacy: string;
  media: any;
  headerLine: string;
  disclaimerId: string;
  disclaimerName: string;
  intro?: string;
  body?: string;
  tagline?: string;
  conclusion?: string;
  imaginativeYear: number;
  status: number;
  isUserFollowed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
