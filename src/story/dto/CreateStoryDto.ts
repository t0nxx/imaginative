export default interface CreateStoryDto {
  ownerId: number;
  listingId?: number;
  privacy: string;
  media: any;
  headerLine: string;
  disclaimerId: number;
  intro?: string;
  body?: string;
  tagline?: string;
  conclusion?: string;
  imaginativeYear: number;
  status: number;
}
