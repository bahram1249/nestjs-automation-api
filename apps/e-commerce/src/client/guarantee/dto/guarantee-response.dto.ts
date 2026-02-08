import { ApiProperty } from '@nestjs/swagger';
import { GuaranteeAttachmentResponseDto } from './attachment-response.dto';

export class GuaranteeResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee ID' })
  id: number;

  @ApiProperty({ example: 'Warranty Name', description: 'Guarantee name' })
  name: string;

  @ApiProperty({ example: 'warranty-name', description: 'Guarantee slug' })
  slug: string;

  @ApiProperty({
    example: 'Description',
    description: 'Guarantee description',
    required: false,
  })
  description?: string;

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
    type: () => GuaranteeAttachmentResponseDto,
    description: 'Attachment',
    required: false,
  })
  attachment?: GuaranteeAttachmentResponseDto;
}
