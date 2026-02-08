import { ApiProperty } from '@nestjs/swagger';
import { AttachmentBasicResponseDto } from './attachment-basic-response.dto';
import { VendorCommissionResponseDto } from './vendor-commission-response.dto';

export class UserVendorResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor ID' })
  id: number;

  @ApiProperty({ example: 'Vendor Name', description: 'Vendor name' })
  name: string;

  @ApiProperty({ example: 'vendor-name', description: 'Vendor slug' })
  slug: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'Vendor address',
    required: false,
  })
  address?: string;

  @ApiProperty({ example: 1, description: 'Priority order', required: false })
  priorityOrder?: number;

  @ApiProperty({
    type: AttachmentBasicResponseDto,
    description: 'Vendor attachment',
    required: false,
  })
  attachment?: AttachmentBasicResponseDto;

  @ApiProperty({
    type: VendorCommissionResponseDto,
    isArray: true,
    description: 'Vendor commissions',
    required: false,
  })
  commissions?: VendorCommissionResponseDto[];
}
