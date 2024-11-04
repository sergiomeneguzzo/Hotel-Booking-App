export interface IBooking extends Document {
  userId: string;
  hotelId: string;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  status: 'confirmed' | 'pending' | 'canceled';
}
