// hotel.model.ts
import mongoose from 'mongoose';
import { IHotel } from './hotel.entity';

const hotelSchema = new mongoose.Schema<IHotel>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    amenities: { type: [String], required: true },
    photos: { type: [String], required: true },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IHotel>('Hotel', hotelSchema);
