import { AutoMap } from 'automapper-classes';
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
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
  @IsString()
  latitude: string;

  @AutoMap()
  @IsString()
  longitude: string;

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

  @AutoMap()
  @IsString()
  @MinLength(10)
  @MaxLength(10)
  postalCode: string;
}
