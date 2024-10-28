export interface Hotel {
  id?: string;
  name: string;
  description: string;
  location: string;
  maxGuests: number;
  amenities: string[];
  photos: string[];
}
