import HotelType from './hotel-type.model';
import { IHotelType } from './hotel-type.entity';
import { HotelTypeDTO } from './hotel-type.dto';

export default class HotelTypeService {
  public static async createHotelType(
    hotelTypeData: HotelTypeDTO,
  ): Promise<IHotelType> {
    if (!hotelTypeData.name) {
      throw new Error("The 'name' property is required.");
    }
    const hotelType = new HotelType(hotelTypeData);
    return await hotelType.save();
  }

  public static async getAllHotelTypes(): Promise<IHotelType[]> {
    return await HotelType.find();
  }

  public static async getHotelTypeById(id: string): Promise<IHotelType | null> {
    return await HotelType.findById(id);
  }

  public static async updateHotelType(
    id: string,
    hotelTypeData: Partial<HotelTypeDTO>,
  ): Promise<IHotelType | null> {
    return await HotelType.findByIdAndUpdate(id, hotelTypeData, { new: true });
  }

  public static async deleteHotelType(id: string): Promise<IHotelType | null> {
    return await HotelType.findByIdAndDelete(id);
  }
}
