import { ApiProperty } from '@nestjs/swagger';
import { ClientProductAttachmentResponseDto } from './attachment-response.dto';

export class ClientProductVendorResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor ID' })
  id: number;

  @ApiProperty({ example: 'Vendor Name', description: 'Vendor name' })
  name: string;

  @ApiProperty({
    example: 'vendor-slug',
    description: 'Vendor slug',
    required: false,
  })
  slug?: string;

  @ApiProperty({ example: 1, description: 'Priority order', required: false })
  priorityOrder?: number;

  @ApiProperty({
    type: () => ClientProductAttachmentResponseDto,
    description: 'Vendor attachment',
    required: false,
  })
  attachment?: ClientProductAttachmentResponseDto;
}
