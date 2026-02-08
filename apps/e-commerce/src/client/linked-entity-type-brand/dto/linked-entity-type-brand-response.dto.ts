import { ApiProperty } from '@nestjs/swagger';

export class LinkedEntityTypeBrandAttachmentResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment ID' })
  id: number;

  @ApiProperty({ example: 'uuid.jpg', description: 'File name' })
  fileName: string;
}

export class LinkedEntityTypeBrandEntityTypeDto {
  @ApiProperty({ example: 1, description: 'Entity type ID' })
  id: number;

  @ApiProperty({ example: 'Mobile', description: 'Entity type name' })
  name: string;

  @ApiProperty({ example: 'mobile', description: 'Entity type slug' })
  slug: string;

  @ApiProperty({ example: 1, description: 'Attachment ID', required: false })
  attachmentId?: bigint;

  @ApiProperty({
    type: () => LinkedEntityTypeBrandAttachmentResponseDto,
    description: 'Attachment',
    required: false,
  })
  attachment?: LinkedEntityTypeBrandAttachmentResponseDto;
}

export class LinkedEntityTypeBrandBrandDto {
  @ApiProperty({ example: 1, description: 'Brand ID' })
  id: number;

  @ApiProperty({ example: 'Apple', description: 'Brand name' })
  name: string;

  @ApiProperty({ example: 'apple', description: 'Brand slug' })
  slug: string;

  @ApiProperty({ example: 1, description: 'Attachment ID', required: false })
  attachmentId?: bigint;

  @ApiProperty({
    type: () => LinkedEntityTypeBrandAttachmentResponseDto,
    description: 'Attachment',
    required: false,
  })
  attachment?: LinkedEntityTypeBrandAttachmentResponseDto;
}

export class LinkedEntityTypeBrandResponseDto {
  @ApiProperty({ example: 1, description: 'Linked entity type brand ID' })
  id: number;

  @ApiProperty({ example: 'Title', description: 'Title' })
  title: string;

  @ApiProperty({ example: 1, description: 'Entity type ID' })
  entityTypeId: number;

  @ApiProperty({
    type: () => LinkedEntityTypeBrandEntityTypeDto,
    description: 'Entity type',
  })
  entityType?: LinkedEntityTypeBrandEntityTypeDto;

  @ApiProperty({ example: 1, description: 'Brand ID' })
  brandId: number;

  @ApiProperty({
    type: () => LinkedEntityTypeBrandBrandDto,
    description: 'Brand',
  })
  brand?: LinkedEntityTypeBrandBrandDto;

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
    example: 'Description',
    description: 'Description',
    required: false,
  })
  description?: string;
}
