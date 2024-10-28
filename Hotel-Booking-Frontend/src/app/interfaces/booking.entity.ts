export interface Booking {
  userId: string;
  hotelId: string;
  roomType: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  status: 'confirmed' | 'pending' | 'canceled';
}
