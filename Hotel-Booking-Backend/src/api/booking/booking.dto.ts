import {
  IsString,
  IsDate,
  IsNumber,
  IsIn,
  IsNotEmpty,
  Min,
  Max,
  IsMongoId,
} from 'class-validator';

export class BookingDTO {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsMongoId()
  @IsNotEmpty()
  hotel!: string;

  @IsDate()
  @IsNotEmpty()
  checkInDate!: Date;

  @IsDate()
  @IsNotEmpty()
  checkOutDate!: Date;

  @IsNumber()
  @Min(1, { message: 'Il numero di ospiti deve essere almeno 1.' })
  @Max(10, { message: 'Il numero massimo di ospiti è 10.' })
  guests!: number;

  @IsString()
  @IsIn(['confirmed', 'pending', 'canceled'], {
    message:
      "Lo stato deve essere uno tra 'confirmed', 'pending' o 'canceled'.",
  })
  status!: 'confirmed' | 'pending' | 'canceled';
}
