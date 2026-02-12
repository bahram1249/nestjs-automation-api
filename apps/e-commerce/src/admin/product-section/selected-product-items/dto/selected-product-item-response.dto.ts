import { ApiProperty } from '@nestjs/swagger';

export class ProductAttachmentResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment ID' })
  id: bigint;

  @ApiProperty({ example: 'product-image.jpg', description: 'File name' })
  fileName: string;
}

export class ProductResponseDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: bigint;

  @ApiProperty({ example: 'iPhone 15', description: 'Product title' })
  title: string;

  @ApiProperty({ example: 'SKU-12345', description: 'SKU', required: false })
  sku?: string;

  @ApiProperty({ example: 'iphone-15', description: 'URL slug' })
  slug: string;

  @ApiProperty({
    description: 'Product attachments',
    type: () => ProductAttachmentResponseDto,
    isArray: true,
    required: false,
  })
  attachments?: ProductAttachmentResponseDto[];
}

export class SelectedProductInfoResponseDto {
  @ApiProperty({ example: 1, description: 'Selected Product ID' })
  id: number;

  @ApiProperty({ example: 'Summer Collection', description: 'Product title' })
  title: string;
}

export class SelectedProductItemResponseDto {
  @ApiProperty({ example: 1, description: 'Selected Product ID' })
  selectedProductId: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({
    description: 'Selected product info',
    type: () => SelectedProductInfoResponseDto,
    required: false,
  })
  selectedProduct?: SelectedProductInfoResponseDto;

  @ApiProperty({
    description: 'Product info',
    type: () => ProductResponseDto,
    required: false,
  })
  product?: ProductResponseDto;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}
