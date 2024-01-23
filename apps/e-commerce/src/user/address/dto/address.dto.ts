import { AutoMap } from 'automapper-classes';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AddressDto {
  @MinLength(3)
  @MaxLength(512)
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @AutoMap()
  @IsNumber()
  latitude: number;

  @AutoMap()
  @IsNumber()
  longitude: number;

  @AutoMap()
  @IsNumber()
  provinceId: number;

  @AutoMap()
  @IsNumber()
  cityId: number;

  @AutoMap()
  @IsNumber()
  @IsOptional()
  neighborhoodId?: number;

  @MinLength(3)
  @MaxLength(1024)
  @IsNotEmpty()
  @AutoMap()
  street: string;

  @MinLength(3)
  @MaxLength(1024)
  @IsOptional()
  @AutoMap()
  alley?: string;

  @IsOptional()
  @AutoMap()
  plaque?: string;

  @IsOptional()
  @AutoMap()
  floorNumber?: string;
}
