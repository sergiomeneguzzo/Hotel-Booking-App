import mongoose from 'mongoose';
import { IBooking } from './booking.entity';

export const bookingSchema = new mongoose.Schema<IBooking>(
  {
    userId: { type: String, required: true },
    hotelId: { type: String, required: true },
    roomType: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: { type: Number, required: true },
    status: {
      type: String,
      enum: ['confirmed', 'pending', 'canceled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export default mongoose.model<IBooking>('Booking', bookingSchema);
