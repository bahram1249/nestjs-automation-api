import { ApiProperty } from '@nestjs/swagger';

export class SelectedProductTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Selected Product Type ID' })
  id: number;

  @ApiProperty({ example: 'Featured', description: 'Type title' })
  title: string;
}

export class AttachmentResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment ID' })
  id: bigint;

  @ApiProperty({ example: 'filename.jpg', description: 'File name' })
  fileName: string;
}

export class SelectedProductResponseDto {
  @ApiProperty({ example: 1, description: 'Selected Product ID' })
  id: number;

  @ApiProperty({ example: 'Summer Collection', description: 'Product title' })
  title: string;

  @ApiProperty({ example: 'summer-collection', description: 'URL slug' })
  slug: string;

  @ApiProperty({
    example: 'Summer Collection Meta Title',
    description: 'Meta title',
    required: false,
  })
  metaTitle?: string;

  @ApiProperty({
    example: 'summer, collection',
    description: 'Meta keywords',
    required: false,
  })
  metaKeywords?: string;

  @ApiProperty({
    example: 'Summer collection description',
    description: 'Meta description',
    required: false,
  })
  metaDescription?: string;

  @ApiProperty({
    example: 'Detailed description',
    description: 'Description',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 1, description: 'Priority', required: false })
  priority?: number;

  @ApiProperty({ example: 1, description: 'Selected Product Type ID' })
  selectedProductTypeId: number;

  @ApiProperty({
    description: 'Selected product type',
    type: () => SelectedProductTypeResponseDto,
    required: false,
  })
  selectedProductType?: SelectedProductTypeResponseDto;

  @ApiProperty({
    description: 'Attachment',
    type: () => AttachmentResponseDto,
    required: false,
  })
  attachment?: AttachmentResponseDto;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}

export class SelectedProductDeleteResponseDto {
  @ApiProperty({ example: 1, description: 'Selected Product ID' })
  id: number;

  @ApiProperty({ example: 'Summer Collection', description: 'Product title' })
  title: string;

  @ApiProperty({ example: 'summer-collection', description: 'URL slug' })
  slug: string;

  @ApiProperty({
    example: 'Summer Collection Meta Title',
    description: 'Meta title',
    required: false,
  })
  metaTitle?: string;

  @ApiProperty({
    example: 'summer, collection',
    description: 'Meta keywords',
    required: false,
  })
  metaKeywords?: string;

  @ApiProperty({
    example: 'Summer collection description',
    description: 'Meta description',
    required: false,
  })
  metaDescription?: string;

  @ApiProperty({
    example: 'Detailed description',
    description: 'Description',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 1, description: 'Priority', required: false })
  priority?: number;

  @ApiProperty({ example: 1, description: 'Selected Product Type ID' })
  selectedProductTypeId: number;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}

export class SelectedProductImageResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment ID' })
  id: bigint;

  @ApiProperty({ example: 'filename.jpg', description: 'File name' })
  fileName: string;
}
