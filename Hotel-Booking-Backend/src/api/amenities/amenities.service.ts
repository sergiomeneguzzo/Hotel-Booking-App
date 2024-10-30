import { Amenity } from './amenities.model';
import { AmenityDTO } from './amenities.dto';

class AmenityService {
  async createAmenity(amenityDTO: AmenityDTO) {
    const amenity = new Amenity(amenityDTO);
    return await amenity.save();
  }

  async getAllAmenities() {
    return await Amenity.find();
  }

  async getAmenityById(id: string) {
    return await Amenity.findById(id);
  }

  async updateAmenity(id: string, amenityData: Partial<AmenityDTO>) {
    return await Amenity.findByIdAndUpdate(id, amenityData, { new: true });
  }

  async deleteAmenity(id: string) {
    return await Amenity.findByIdAndDelete(id);
  }
}

export default new AmenityService();
