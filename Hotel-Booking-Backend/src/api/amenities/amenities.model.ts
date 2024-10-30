import mongoose, { Schema } from 'mongoose';
import { IAmenity } from './amenities.entity';

const amenitySchema = new Schema<IAmenity>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Amenity = mongoose.model<IAmenity>('Amenity', amenitySchema);
