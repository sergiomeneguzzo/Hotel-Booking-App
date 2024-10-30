import { IAmenity } from '../amenities/amenities.entity';
import { IHotelType } from '../hotel-type/hotel-type.entity';

export interface IHotel {
  id?: string;
  name: string;
  description: string;
  location: string;
  maxGuests: number;
  amenities: string[] | IAmenity[];
  photos: string[];
  pricePerNight: number;
  hotelTypeId: string | IHotelType;
}
