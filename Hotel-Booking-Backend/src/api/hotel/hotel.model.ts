import mongoose from 'mongoose';
import { IHotel } from './hotel.entity';

const hotelSchema = new mongoose.Schema<IHotel>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    amenities: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Amenity', required: true },
    ],
    photos: { type: [String], required: true },
    pricePerNight: { type: Number, required: true },
    hotelTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HotelType',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IHotel>('Hotel', hotelSchema);
