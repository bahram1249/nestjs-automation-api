import { ApiProperty } from '@nestjs/swagger';
import { AdminVendorAttachmentResponseDto } from './attachment-response.dto';
import { VendorUserResponseDto } from './vendor-user-response.dto';
import { VendorCommissionResponseDto } from './vendor-commission-response.dto';
import { VendorLogisticResponseDto } from './vendor-logistic-response.dto';

export class AdminVendorResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor ID' })
  id: number;

  @ApiProperty({ example: 'Vendor Name', description: 'Vendor Name' })
  name: string;

  @ApiProperty({ example: 'vendor-slug', description: 'Vendor Slug' })
  slug: string;

  @ApiProperty({
    example: 'Vendor Address',
    description: 'Vendor Address',
    required: false,
  })
  address?: string;

  @ApiProperty({
    example: 'Vendor Description',
    description: 'Vendor Description',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 1, description: 'Priority Order', required: false })
  priorityOrder?: number;

  @ApiProperty({
    example: 'Vendor Meta Title',
    description: 'Meta Title',
    required: false,
  })
  metaTitle?: string;

  @ApiProperty({
    example: 'Vendor Meta Keywords',
    description: 'Meta Keywords',
    required: false,
  })
  metaKeywords?: string;

  @ApiProperty({
    example: 'Vendor Meta Description',
    description: 'Meta Description',
    required: false,
  })
  metaDescription?: string;

  @ApiProperty({ example: true, description: 'Is Active', required: false })
  isActive?: boolean;

  @ApiProperty({ example: 1, description: 'Province ID', required: false })
  provinceId?: number;

  @ApiProperty({ example: 1, description: 'City ID', required: false })
  cityId?: number;

  @ApiProperty({ example: '35.7219', description: 'Latitude', required: false })
  latitude?: string;

  @ApiProperty({
    example: '51.3347',
    description: 'Longitude',
    required: false,
  })
  longitude?: string;

  @ApiProperty({
    type: () => AdminVendorAttachmentResponseDto,
    description: 'Attachment details',
    required: false,
  })
  attachment?: AdminVendorAttachmentResponseDto;

  @ApiProperty({
    type: () => VendorUserResponseDto,
    description: 'Default Vendor User',
    required: false,
  })
  vendorUser?: VendorUserResponseDto;

  @ApiProperty({
    type: () => [VendorCommissionResponseDto],
    description: 'Vendor Commissions',
    required: false,
  })
  commissions?: VendorCommissionResponseDto[];

  @ApiProperty({
    type: () => VendorLogisticResponseDto,
    description: 'Default Vendor Logistic',
    required: false,
  })
  vendorLogistic?: VendorLogisticResponseDto;
}
