import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class HotelDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  location!: string;

  @IsNumber()
  @Min(1, { message: 'Il numero massimo di ospiti deve essere almeno 1.' })
  maxGuests!: number;

  @IsArray()
  @IsMongoId({ each: true })
  amenities!: string[];

  @IsArray()
  @IsString({ each: true })
  photos!: string[];

  @IsNumber()
  @IsNotEmpty()
  pricePerNight!: number;

  @IsMongoId()
  @IsNotEmpty()
  hotelTypeId!: string;
}
