export interface IBooking extends Document {
  userId: string;
  hotelId: string;
  roomType: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  status: 'confirmed' | 'pending' | 'canceled';
}
