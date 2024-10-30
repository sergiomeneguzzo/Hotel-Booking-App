import Hotel from './hotel.model';
import { IHotel } from './hotel.entity';
import { HotelDTO } from './hotel.dto';

export default class HotelService {
  public static async createHotel(hotelData: HotelDTO): Promise<IHotel> {
    const hotel = new Hotel(hotelData);
    return await hotel.save();
  }

  public static async getAllHotels(): Promise<IHotel[]> {
    return await Hotel.find().populate('hotelTypeId').populate('amenities');
  }

  public static async getHotelById(id: string): Promise<IHotel | null> {
    return await Hotel.findById(id)
      .populate('hotelTypeId')
      .populate('amenities');
  }

  public static async updateHotel(
    id: string,
    hotelData: Partial<HotelDTO>,
  ): Promise<IHotel | null> {
    return await Hotel.findByIdAndUpdate(id, hotelData, { new: true })
      .populate('hotelTypeId')
      .populate('amenities');
  }

  public static async deleteHotel(id: string): Promise<IHotel | null> {
    return await Hotel.findByIdAndDelete(id);
  }
}
