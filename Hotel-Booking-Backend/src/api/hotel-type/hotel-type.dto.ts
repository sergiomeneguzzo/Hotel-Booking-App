import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class HotelTypeDTO {
  @IsString()
  @IsNotEmpty({ message: 'Il nome è obbligatorio' })
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}
