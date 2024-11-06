import { Hotel } from './hotel.entity';

export interface Booking {
  id: string;
  userId: string;
  hotel: Hotel;
  roomType: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  status: 'confirmed' | 'pending' | 'canceled';
}
