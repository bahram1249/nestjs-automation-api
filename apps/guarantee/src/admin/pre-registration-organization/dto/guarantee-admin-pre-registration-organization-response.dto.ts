import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminPreRegistrationOrganizationProvinceResponseDto {
  @ApiProperty({ example: 1, description: 'Province ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'Province name' })
  name?: string;
}

export class GuaranteeAdminPreRegistrationOrganizationCityResponseDto {
  @ApiProperty({ example: 1, description: 'City ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'City name' })
  name?: string;
}

export class GuaranteeAdminPreRegistrationOrganizationNeighborhoodResponseDto {
  @ApiProperty({ example: 1, description: 'Neighborhood ID' })
  id: number;

  @ApiProperty({
    example: 'Neighborhood Name',
    description: 'Neighborhood name',
  })
  name?: string;
}

export class GuaranteeAdminPreRegistrationOrganizationAddressResponseDto {
  @ApiProperty({ example: 1, description: 'Address ID' })
  id: number;

  @ApiProperty({
    type: () => GuaranteeAdminPreRegistrationOrganizationProvinceResponseDto,
    description: 'Province',
    required: false,
  })
  province?: GuaranteeAdminPreRegistrationOrganizationProvinceResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminPreRegistrationOrganizationCityResponseDto,
    description: 'City',
    required: false,
  })
  city?: GuaranteeAdminPreRegistrationOrganizationCityResponseDto;

  @ApiProperty({
    type: () =>
      GuaranteeAdminPreRegistrationOrganizationNeighborhoodResponseDto,
    description: 'Neighborhood',
    required: false,
  })
  neighborhood?: GuaranteeAdminPreRegistrationOrganizationNeighborhoodResponseDto;
}

export class GuaranteeAdminPreRegistrationOrganizationAttachmentResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment ID' })
  id: number;

  @ApiProperty({ example: 'filename.jpg', description: 'File name' })
  fileName?: string;
}

export class GuaranteeAdminPreRegistrationOrganizationResponseDto {
  @ApiProperty({ example: 1, description: 'Pre-registration Organization ID' })
  id: number;

  @ApiProperty({ example: 'Organization Title', description: 'Title' })
  title?: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'License date',
    required: false,
  })
  licenseDate?: Date;

  @ApiProperty({
    example: 1,
    description: 'License attachment ID',
    required: false,
  })
  licenseAttachmentId?: number;

  @ApiProperty({
    example: 1,
    description: 'Estate attachment ID',
    required: false,
  })
  estateAttachmentId?: number;

  @ApiProperty({
    example: 1,
    description: 'Postal attachment ID',
    required: false,
  })
  postalAttachmentId?: number;

  @ApiProperty({
    example: 1,
    description: 'National attachment ID',
    required: false,
  })
  nationalAttachmentId?: number;

  @ApiProperty({ example: 1, description: 'Address ID', required: false })
  addressId?: number;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastname?: string;

  @ApiProperty({ example: '09123456789', description: 'Phone number' })
  phoneNumber?: string;

  @ApiProperty({ example: false, description: 'Is confirmed' })
  isConfirm?: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Confirm date',
    required: false,
  })
  confirmDate?: Date;

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
    example: 'CODE123',
    description: 'License code',
    required: false,
  })
  licenseCode?: string;

  @ApiProperty({
    type: () => GuaranteeAdminPreRegistrationOrganizationAddressResponseDto,
    description: 'Address',
    required: false,
  })
  address?: GuaranteeAdminPreRegistrationOrganizationAddressResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminPreRegistrationOrganizationAttachmentResponseDto,
    description: 'License attachment',
    required: false,
  })
  licenseAttachment?: GuaranteeAdminPreRegistrationOrganizationAttachmentResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminPreRegistrationOrganizationAttachmentResponseDto,
    description: 'National attachment',
    required: false,
  })
  nationalAttachment?: GuaranteeAdminPreRegistrationOrganizationAttachmentResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminPreRegistrationOrganizationAttachmentResponseDto,
    description: 'Estate attachment',
    required: false,
  })
  estateAttachment?: GuaranteeAdminPreRegistrationOrganizationAttachmentResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminPreRegistrationOrganizationAttachmentResponseDto,
    description: 'Postal attachment',
    required: false,
  })
  postalAttachment?: GuaranteeAdminPreRegistrationOrganizationAttachmentResponseDto;
}
