export default interface CreateStoryDto {
  id: string;
  ownerId: string;
  listingId?: string;
  privacy: string;
  media: any;
  headerLine: string;
  disclaimerId: string;
  intro?: string;
  body?: string;
  tagline?: string;
  conclusion?: string;
  imaginativeYear: number;
  status: number;
}
