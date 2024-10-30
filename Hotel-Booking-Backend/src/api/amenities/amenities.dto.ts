import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AmenityDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
