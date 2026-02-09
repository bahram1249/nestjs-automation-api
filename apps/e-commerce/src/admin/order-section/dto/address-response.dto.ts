import { ApiProperty } from '@nestjs/swagger';
import { ProvinceResponseDto } from './province-response.dto';
import { CityResponseDto } from './city-response.dto';
import { NeighborhoodResponseDto } from './neighborhood-response.dto';

export class AdminOrderAddressResponseDto {
  @ApiProperty({ example: 1, description: 'Address ID' })
  id: bigint;

  @ApiProperty({
    example: 'Home',
    description: 'Address name',
    required: false,
  })
  name?: string;

  @ApiProperty({ example: '35.7219', description: 'Latitude', required: false })
  latitude?: string;

  @ApiProperty({
    example: '51.3347',
    description: 'Longitude',
    required: false,
  })
  longitude?: string;

  @ApiProperty({ example: 1, description: 'Province ID' })
  provinceId: number;

  @ApiProperty({ example: 1, description: 'City ID' })
  cityId: number;

  @ApiProperty({ example: 1, description: 'Neighborhood ID', required: false })
  neighborhoodId?: number;

  @ApiProperty({
    example: 'Main Street',
    description: 'Street',
    required: false,
  })
  street?: string;

  @ApiProperty({ example: '12', description: 'Alley', required: false })
  alley?: string;

  @ApiProperty({ example: '45', description: 'Plaque', required: false })
  plaque?: string;

  @ApiProperty({ example: '3', description: 'Floor number', required: false })
  floorNumber?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Postal code',
    required: false,
  })
  postalCode?: string;

  @ApiProperty({
    type: () => ProvinceResponseDto,
    description: 'Province details',
    required: false,
  })
  province?: ProvinceResponseDto;

  @ApiProperty({
    type: () => CityResponseDto,
    description: 'City details',
    required: false,
  })
  city?: CityResponseDto;

  @ApiProperty({
    type: () => NeighborhoodResponseDto,
    description: 'Neighborhood details',
    required: false,
  })
  neighborhood?: NeighborhoodResponseDto;
}
