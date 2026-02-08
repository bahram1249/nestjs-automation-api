import { ApiProperty } from '@nestjs/swagger';
import { AttachmentResponseDto } from './attachment-response.dto';

export class VendorResponseDto {
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
    type: () => AttachmentResponseDto,
    description: 'Vendor attachment',
    required: false,
  })
  attachment?: AttachmentResponseDto;
}
