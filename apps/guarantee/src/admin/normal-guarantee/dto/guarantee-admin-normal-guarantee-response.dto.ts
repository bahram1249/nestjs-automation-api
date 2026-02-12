import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminNormalGuaranteeProviderResponseDto {
  @ApiProperty({ example: 1, description: 'Provider ID' })
  id: number;

  @ApiProperty({ example: 'Provider Name', description: 'Provider name' })
  name?: string;
}

export class GuaranteeAdminNormalGuaranteeBrandResponseDto {
  @ApiProperty({ example: 1, description: 'Brand ID' })
  id: number;

  @ApiProperty({ example: 'Brand Name', description: 'Brand name' })
  name?: string;
}

export class GuaranteeAdminNormalGuaranteeTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee Type ID' })
  id: number;

  @ApiProperty({ example: 'Normal', description: 'Guarantee type name' })
  name?: string;
}

export class GuaranteeAdminNormalGuaranteePeriodResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee Period ID' })
  id: number;

  @ApiProperty({ example: '12 months', description: 'Guarantee period name' })
  name?: string;
}

export class GuaranteeAdminNormalGuaranteeConfirmStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Confirm Status ID' })
  id: number;

  @ApiProperty({ example: 'Confirmed', description: 'Confirm status name' })
  name?: string;
}

export class GuaranteeAdminNormalGuaranteeVariantResponseDto {
  @ApiProperty({ example: 1, description: 'Variant ID' })
  id: number;

  @ApiProperty({ example: 'Variant Name', description: 'Variant name' })
  name?: string;
}

export class GuaranteeAdminNormalGuaranteeProductTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Product Type ID' })
  id: number;

  @ApiProperty({ example: 'Product Type', description: 'Product type name' })
  name?: string;
}

export class GuaranteeAdminNormalGuaranteeAssignedUserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: number;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  username?: string;

  @ApiProperty({ example: '09123456789', description: 'Phone number' })
  phoneNumber?: string;
}

export class GuaranteeAdminNormalGuaranteeAssignedGuaranteeResponseDto {
  @ApiProperty({ example: 1, description: 'Assigned Guarantee ID' })
  id: number;

  @ApiProperty({
    type: () => GuaranteeAdminNormalGuaranteeAssignedUserResponseDto,
    description: 'Assigned user',
    required: false,
  })
  user?: GuaranteeAdminNormalGuaranteeAssignedUserResponseDto;
}

export class GuaranteeAdminNormalGuaranteeResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Provider ID', required: false })
  providerId?: number;

  @ApiProperty({ example: 1, description: 'Brand ID', required: false })
  brandId?: number;

  @ApiProperty({ example: 1, description: 'Guarantee Type ID' })
  guaranteeTypeId: number;

  @ApiProperty({
    example: 1,
    description: 'Guarantee Period ID',
    required: false,
  })
  guaranteePeriodId?: number;

  @ApiProperty({ example: 1, description: 'Guarantee Confirm Status ID' })
  guaranteeConfirmStatusId: number;

  @ApiProperty({
    example: 'PRE',
    description: 'Prefix serial',
    required: false,
  })
  prefixSerial?: string;

  @ApiProperty({ example: '123456789', description: 'Serial number' })
  serialNumber: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Start date',
  })
  startDate: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'End date' })
  endDate: Date;

  @ApiProperty({
    example: '2024-06-01T00:00:00.000Z',
    description: 'Allowed date enter product',
    required: false,
  })
  allowedDateEnterProduct?: Date;

  @ApiProperty({ example: 1, description: 'Variant ID', required: false })
  variantId?: number;

  @ApiProperty({ example: 1, description: 'Product Type ID', required: false })
  productTypeId?: number;

  @ApiProperty({
    example: 'Description text',
    description: 'Description',
    required: false,
  })
  description?: string;

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
    type: () => GuaranteeAdminNormalGuaranteeProviderResponseDto,
    description: 'Provider',
    required: false,
  })
  provider?: GuaranteeAdminNormalGuaranteeProviderResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminNormalGuaranteeBrandResponseDto,
    description: 'Brand',
    required: false,
  })
  brand?: GuaranteeAdminNormalGuaranteeBrandResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminNormalGuaranteeTypeResponseDto,
    description: 'Guarantee type',
    required: false,
  })
  guaranteeType?: GuaranteeAdminNormalGuaranteeTypeResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminNormalGuaranteePeriodResponseDto,
    description: 'Guarantee period',
    required: false,
  })
  guaranteePeriod?: GuaranteeAdminNormalGuaranteePeriodResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminNormalGuaranteeConfirmStatusResponseDto,
    description: 'Guarantee confirm status',
    required: false,
  })
  guaranteeConfirmStatus?: GuaranteeAdminNormalGuaranteeConfirmStatusResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminNormalGuaranteeVariantResponseDto,
    description: 'Variant',
    required: false,
  })
  variant?: GuaranteeAdminNormalGuaranteeVariantResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminNormalGuaranteeProductTypeResponseDto,
    description: 'Product type',
    required: false,
  })
  productType?: GuaranteeAdminNormalGuaranteeProductTypeResponseDto;

  @ApiProperty({
    type: () => GuaranteeAdminNormalGuaranteeAssignedGuaranteeResponseDto,
    description: 'Assigned guarantee',
    required: false,
  })
  assignedGuarantee?: GuaranteeAdminNormalGuaranteeAssignedGuaranteeResponseDto;
}
