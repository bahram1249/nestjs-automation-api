import { ApiProperty } from '@nestjs/swagger';
import { ClientVendorAttachmentResponseDto } from './attachment-response.dto';

export class ClientVendorResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor ID' })
  id: number;

  @ApiProperty({ example: 'Vendor Name', description: 'Vendor name' })
  name: string;

  @ApiProperty({ example: 'vendor-slug', description: 'Vendor slug' })
  slug: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'Vendor address',
    required: false,
  })
  address?: string;

  @ApiProperty({
    example: 'Vendor description',
    description: 'Vendor description',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 1, description: 'Priority order', required: false })
  priorityOrder?: number;

  @ApiProperty({
    example: 'Meta Title',
    description: 'Meta title',
    required: false,
  })
  metaTitle?: string;

  @ApiProperty({
    example: 'meta, keywords',
    description: 'Meta keywords',
    required: false,
  })
  metaKeywords?: string;

  @ApiProperty({
    example: 'Meta description',
    description: 'Meta description',
    required: false,
  })
  metaDescription?: string;

  @ApiProperty({
    type: () => ClientVendorAttachmentResponseDto,
    description: 'Vendor attachment',
    required: false,
  })
  attachment?: ClientVendorAttachmentResponseDto;
}
