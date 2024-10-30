import mongoose from 'mongoose';
import { IHotelType } from './hotel-type.entity';

const hotelTypeSchema = new mongoose.Schema<IHotelType>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IHotelType>('HotelType', hotelTypeSchema);
