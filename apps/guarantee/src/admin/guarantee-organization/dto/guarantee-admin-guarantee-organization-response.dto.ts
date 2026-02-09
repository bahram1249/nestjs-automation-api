import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminGuaranteeOrganizationBpmnOrganizationResponseDto {
  @ApiProperty({ example: 1, description: 'Organization ID' })
  id: number;

  @ApiProperty({
    example: 'Organization Name',
    description: 'Organization name',
  })
  name?: string;
}

export class GuaranteeAdminGuaranteeOrganizationProvinceResponseDto {
  @ApiProperty({ example: 1, description: 'Province ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'Province name' })
  name?: string;

  @ApiProperty({ example: 'tehran', description: 'Province slug' })
  slug?: string;
}

export class GuaranteeAdminGuaranteeOrganizationCityResponseDto {
  @ApiProperty({ example: 1, description: 'City ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'City name' })
  name?: string;
}

export class GuaranteeAdminGuaranteeOrganizationNeighborhoodResponseDto {
  @ApiProperty({ example: 1, description: 'Neighborhood ID' })
  id: number;

  @ApiProperty({
    example: 'Neighborhood Name',
    description: 'Neighborhood name',
  })
  name?: string;
}

export class GuaranteeAdminGuaranteeOrganizationAddressResponseDto {
  @ApiProperty({ example: 1, description: 'Address ID' })
  id: number;

  @ApiProperty({
    example: 'Address Name',
    description: 'Address name',
    required: false,
  })
  name?: string;

  @ApiProperty({ example: 35.6892, description: 'Latitude', required: false })
  latitude?: number;

  @ApiProperty({ example: 51.389, description: 'Longitude', required: false })
  longitude?: number;

  @ApiProperty({ example: 1, description: 'Province ID', required: false })
  provinceId?: number;

  @ApiProperty({ example: 1, description: 'City ID', required: false })
  cityId?: number;

  @ApiProperty({ example: 1, description: 'Neighborhood ID', required: false })
  neighborhoodId?: number;

  @ApiProperty({
    example: 'Street Name',
    description: 'Street',
    required: false,
  })
  street?: string;

  @ApiProperty({ example: 'Alley Name', description: 'Alley', required: false })
  alley?: string;

  @ApiProperty({ example: '123', description: 'Plaque', required: false })
  plaque?: string;

  @ApiProperty({ example: 1, description: 'Floor number', required: false })
  floorNumber?: number;

  @ApiProperty({
    example: '1234567890',
    description: 'Postal code',
    required: false,
  })
  postalCode?: string;

  @ApiProperty({
    type: () => GuaranteeAdminGuaranteeOrganizationProvinceResponseDto,
    description: 'Province',
    required: false,
  })
  province?: GuaranteeAdminGuaranteeOrganizationProvinceResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminGuaranteeOrganizationCityResponseDto,
    description: 'City',
    required: false,
  })
  city?: GuaranteeAdminGuaranteeOrganizationCityResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminGuaranteeOrganizationNeighborhoodResponseDto,
    description: 'Neighborhood',
    required: false,
  })
  neighborhood?: GuaranteeAdminGuaranteeOrganizationNeighborhoodResponseDto;
}

export class GuaranteeAdminGuaranteeOrganizationUserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;

  @ApiProperty({ example: '09123456789', description: 'Phone number' })
  phoneNumber?: string;

  @ApiProperty({
    example: '1234567890',
    description: 'National code',
    required: false,
  })
  nationalCode?: string;
}

export class GuaranteeAdminGuaranteeOrganizationResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee Organization ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Address ID', required: false })
  addressId?: number;

  @ApiProperty({ example: 1, description: 'User ID', required: false })
  userId?: number;

  @ApiProperty({ example: false, description: 'Is nationwide' })
  isNationwide?: boolean;

  @ApiProperty({ example: false, description: 'Is online payment' })
  isOnlinePayment?: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'License date',
    required: false,
  })
  licenseDate?: Date;

  @ApiProperty({
    example: 'CODE123',
    description: 'Organization code',
    required: false,
  })
  code?: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Updated at',
  })
  updatedAt: Date;

  @ApiProperty({
    type: () => GuaranteeAdminGuaranteeOrganizationBpmnOrganizationResponseDto,
    description: 'BPMN Organization',
    required: false,
  })
  organization?: GuaranteeAdminGuaranteeOrganizationBpmnOrganizationResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminGuaranteeOrganizationAddressResponseDto,
    description: 'Address',
    required: false,
  })
  address?: GuaranteeAdminGuaranteeOrganizationAddressResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminGuaranteeOrganizationUserResponseDto,
    description: 'User',
    required: false,
  })
  user?: GuaranteeAdminGuaranteeOrganizationUserResponseDto;
}
