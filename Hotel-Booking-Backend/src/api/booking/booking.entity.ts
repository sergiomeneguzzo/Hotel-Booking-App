import { IHotel } from '../hotel/hotel.entity';

export interface IBooking extends Document {
  userId: string;
  hotel: IHotel;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  status: 'confirmed' | 'pending' | 'canceled';
}
