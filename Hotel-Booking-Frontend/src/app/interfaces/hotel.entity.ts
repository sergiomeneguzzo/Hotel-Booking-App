import { Amenity } from './amenities.entity';
import { HotelType } from './hotel-type.entity';

export interface Hotel {
  _id?: string;
  name: string;
  description: string;
  location: string;
  maxGuests: number;
  amenities: (string | Amenity)[];
  photos: string[];
  pricePerNight: number;
  hotelTypeId: HotelType;
}
