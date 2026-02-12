import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientOrganizationDetailDto {
  @ApiProperty({
    example: 'Organization Name',
    description: 'Organization name',
  })
  name: string;

  @ApiProperty({ example: '09123456789', description: 'Phone number' })
  phoneNumber: string;
}

export class GuaranteeClientOrganizationProvinceDto {
  @ApiProperty({ example: 1, description: 'Province ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'Province name' })
  name: string;
}

export class GuaranteeClientOrganizationCityDto {
  @ApiProperty({ example: 1, description: 'City ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'City name' })
  name: string;
}

export class GuaranteeClientOrganizationNeighborhoodDto {
  @ApiProperty({ example: 1, description: 'Neighborhood ID' })
  id: number;

  @ApiProperty({
    example: 'Neighborhood Name',
    description: 'Neighborhood name',
  })
  name: string;
}

export class GuaranteeClientOrganizationAddressDto {
  @ApiProperty({ example: 1, description: 'Address ID' })
  id: number;

  @ApiProperty({ example: 'Organization Address', description: 'Address name' })
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
    type: GuaranteeClientOrganizationProvinceDto,
    description: 'Province',
    required: false,
  })
  province?: GuaranteeClientOrganizationProvinceDto;

  @ApiProperty({
    type: GuaranteeClientOrganizationCityDto,
    description: 'City',
    required: false,
  })
  city?: GuaranteeClientOrganizationCityDto;

  @ApiProperty({
    type: GuaranteeClientOrganizationNeighborhoodDto,
    description: 'Neighborhood',
    required: false,
  })
  neighborhood?: GuaranteeClientOrganizationNeighborhoodDto;
}

export class GuaranteeClientOrganizationAddressResponseDto {
  @ApiProperty({
    type: GuaranteeClientOrganizationDetailDto,
    description: 'Organization details',
  })
  orgnizationDetail: GuaranteeClientOrganizationDetailDto;

  @ApiProperty({
    type: GuaranteeClientOrganizationAddressDto,
    description: 'Address',
  })
  address: GuaranteeClientOrganizationAddressDto;
}
