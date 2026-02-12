import { ApiProperty } from '@nestjs/swagger';

export class EntityTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Entity Type ID' })
  id: number;

  @ApiProperty({ example: 'Mobile', description: 'Entity Type Name' })
  name: string;

  @ApiProperty({ example: 'mobile', description: 'Entity Type Slug' })
  slug: string;

  @ApiProperty({ example: 1, description: 'Attachment ID', required: false })
  attachmentId?: number;
}

export class AttachmentResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment ID' })
  id: number;

  @ApiProperty({ example: 'image.jpg', description: 'File Name' })
  fileName: string;
}

export class BrandResponseDto {
  @ApiProperty({ example: 1, description: 'Brand ID' })
  id: number;

  @ApiProperty({ example: 'Apple', description: 'Brand Name' })
  name: string;

  @ApiProperty({ example: 'apple', description: 'Brand Slug' })
  slug: string;

  @ApiProperty({ example: 1, description: 'Attachment ID', required: false })
  attachmentId?: number;
}

export class LinkedEntityTypeBrandResponseDto {
  @ApiProperty({ example: 1, description: 'Linked Entity Type Brand ID' })
  id: number;

  @ApiProperty({ example: 'Apple Mobile', description: 'Title' })
  title: string;

  @ApiProperty({ example: 1, description: 'Entity Type ID' })
  entityTypeId: number;

  @ApiProperty({ example: 1, description: 'Brand ID' })
  brandId: number;

  @ApiProperty({
    example: 'Apple Mobile Meta Title',
    description: 'Meta Title',
    required: false,
  })
  metaTitle?: string;

  @ApiProperty({
    example: 'apple, mobile, iphone',
    description: 'Meta Keywords',
    required: false,
  })
  metaKeywords?: string;

  @ApiProperty({
    example: 'Apple mobile products',
    description: 'Meta Description',
    required: false,
  })
  metaDescription?: string;

  @ApiProperty({
    example: 'Description',
    description: 'Description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Entity Type',
    type: () => EntityTypeResponseDto,
    required: false,
  })
  entityType?: EntityTypeResponseDto;

  @ApiProperty({
    description: 'Brand',
    type: () => BrandResponseDto,
    required: false,
  })
  brand?: BrandResponseDto;
}
