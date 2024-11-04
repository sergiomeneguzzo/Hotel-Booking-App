import Booking from './booking.model';
import { IBooking } from './booking.entity';
import { BookingDTO } from './booking.dto';

export default class BookingService {
  public static async createBooking(
    bookingData: BookingDTO,
  ): Promise<IBooking> {
    const booking = new Booking(bookingData);
    return await booking.save();
  }

  public static async getBookingById(
    bookingId: string,
  ): Promise<IBooking | null> {
    return await Booking.findById(bookingId).exec();
  }

  public static async updateBooking(
    bookingId: string,
    updates: Partial<IBooking>,
  ): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(bookingId, updates, {
      new: true,
    }).exec();
  }

  public static async cancelBooking(
    bookingId: string,
  ): Promise<IBooking | null> {
    return await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'canceled' },
      { new: true },
    ).exec();
  }

  public static async getBookingsByUser(userId: string): Promise<IBooking[]> {
    return await Booking.find({ userId }).exec();
  }

  public static async getAllBookings(): Promise<IBooking[]> {
    return await Booking.find().exec();
  }

  public static async deleteBooking(bookingId: string): Promise<boolean> {
    const result = await Booking.findByIdAndDelete(bookingId).exec();
    return result !== null;
  }

  public static async isRoomAvailable(
    hotelId: string,
    checkInDate: Date,
    checkOutDate: Date,
  ): Promise<boolean> {
    const bookings = await Booking.find({
      hotelId,
      $or: [
        { checkInDate: { $lt: checkOutDate, $gte: checkInDate } },
        { checkOutDate: { $gt: checkInDate, $lte: checkOutDate } },
        {
          checkInDate: { $lte: checkInDate },
          checkOutDate: { $gte: checkOutDate },
        },
      ],
    }).exec();

    return bookings.length === 0;
  }

  public static async getBookingsByHotel(hotelId: string): Promise<IBooking[]> {
    return await Booking.find({ hotelId }).exec();
  }
}
