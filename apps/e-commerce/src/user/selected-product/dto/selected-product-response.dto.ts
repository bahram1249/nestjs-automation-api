import { ApiProperty } from '@nestjs/swagger';

export class SelectedProductTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Selected product type ID' })
  id: number;

  @ApiProperty({
    example: 'Type Title',
    description: 'Selected product type title',
  })
  title: string;
}

export class SelectedProductAttachmentResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment ID' })
  id: bigint;

  @ApiProperty({ example: 'image.jpg', description: 'File name' })
  fileName: string;
}

export class SelectedProductResponseDto {
  @ApiProperty({ example: 1, description: 'Selected product ID' })
  id: number;

  @ApiProperty({
    example: 'Product Title',
    description: 'Selected product title',
  })
  title: string;

  @ApiProperty({
    example: 'product-slug',
    description: 'Selected product slug',
  })
  slug: string;

  @ApiProperty({
    example: 'Meta Title',
    description: 'Meta title',
    required: false,
  })
  metaTitle?: string;

  @ApiProperty({
    example: 'keyword1, keyword2',
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

  @ApiProperty({ example: 1, description: 'Priority', required: false })
  priority?: number;

  @ApiProperty({ example: 1, description: 'Selected product type ID' })
  selectedProductTypeId: number;

  @ApiProperty({
    type: () => SelectedProductTypeResponseDto,
    description: 'Selected product type details',
    required: false,
  })
  selectedProductType?: SelectedProductTypeResponseDto;

  @ApiProperty({
    type: () => SelectedProductAttachmentResponseDto,
    description: 'Attachment details',
    required: false,
  })
  attachment?: SelectedProductAttachmentResponseDto;

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
}

export class SelectedProductDetailResponseDto extends SelectedProductResponseDto {
  @ApiProperty({
    example: 'Product description',
    description: 'Description',
    required: false,
  })
  description?: string;
}
