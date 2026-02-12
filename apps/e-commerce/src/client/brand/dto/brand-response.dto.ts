import { ApiProperty } from '@nestjs/swagger';
import { ClientBrandAttachmentResponseDto } from './attachment-response.dto';

export class ClientBrandResponseDto {
  @ApiProperty({ example: 1, description: 'Brand ID' })
  id: number;

  @ApiProperty({ example: 'Apple', description: 'Brand name' })
  name: string;

  @ApiProperty({ example: 'apple', description: 'Brand slug' })
  slug: string;

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
    example: 'Brand description',
    description: 'Brand description',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 1, description: 'Priority', required: false })
  priority?: number;

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
    type: () => ClientBrandAttachmentResponseDto,
    description: 'Brand attachment',
    required: false,
  })
  attachment?: ClientBrandAttachmentResponseDto;
}
