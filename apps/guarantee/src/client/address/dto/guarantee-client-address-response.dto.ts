import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientAddressProvinceDto {
  @ApiProperty({ example: 1, description: 'Province ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'Province name' })
  name: string;
}

export class GuaranteeClientAddressCityDto {
  @ApiProperty({ example: 1, description: 'City ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'City name' })
  name: string;
}

export class GuaranteeClientAddressNeighborhoodDto {
  @ApiProperty({ example: 1, description: 'Neighborhood ID' })
  id: number;

  @ApiProperty({
    example: 'Neighborhood Name',
    description: 'Neighborhood name',
  })
  name: string;
}

export class GuaranteeClientAddressItemDto {
  @ApiProperty({ example: 1, description: 'Address ID' })
  id: number;

  @ApiProperty({ example: 'Home', description: 'Address name' })
  name: string;

  @ApiProperty({ example: 35.7, description: 'Latitude' })
  latitude: number;

  @ApiProperty({ example: 51.4, description: 'Longitude' })
  longitude: number;

  @ApiProperty({ example: 1, description: 'Province ID' })
  provinceId: number;

  @ApiProperty({ example: 1, description: 'City ID', required: false })
  cityId?: number;

  @ApiProperty({ example: 1, description: 'Neighborhood ID' })
  neighborhoodId: number;

  @ApiProperty({ example: 'Street Name', description: 'Street' })
  street: string;

  @ApiProperty({ example: 'Alley Name', description: 'Alley' })
  alley: string;

  @ApiProperty({ example: '123', description: 'Plaque number' })
  plaque: string;

  @ApiProperty({ example: '1', description: 'Floor number' })
  floorNumber: string;

  @ApiProperty({ example: '1234567890', description: 'Postal code' })
  postalCode: string;

  @ApiProperty({
    type: GuaranteeClientAddressProvinceDto,
    description: 'Province',
    required: false,
  })
  province?: GuaranteeClientAddressProvinceDto;

  @ApiProperty({
    type: GuaranteeClientAddressCityDto,
    description: 'City',
    required: false,
  })
  city?: GuaranteeClientAddressCityDto;

  @ApiProperty({
    type: GuaranteeClientAddressNeighborhoodDto,
    description: 'Neighborhood',
    required: false,
  })
  neighborhood?: GuaranteeClientAddressNeighborhoodDto;
}

export class GuaranteeClientAddressListResponseDto {
  @ApiProperty({
    type: [GuaranteeClientAddressItemDto],
    description: 'List of addresses',
  })
  result: GuaranteeClientAddressItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}

export class GuaranteeClientAddressSingleResponseDto {
  @ApiProperty({ type: GuaranteeClientAddressItemDto, description: 'Address' })
  result: GuaranteeClientAddressItemDto;
}
