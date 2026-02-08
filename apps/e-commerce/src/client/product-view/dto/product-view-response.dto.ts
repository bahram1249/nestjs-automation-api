import { ApiProperty } from '@nestjs/swagger';

export class ProductViewResponseDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: bigint;

  @ApiProperty({ example: 'Product Title', description: 'Product title' })
  title: string;

  @ApiProperty({ example: 'product-slug', description: 'Product slug' })
  slug: string;

  @ApiProperty({
    example: 'SKU123',
    description: 'Product SKU',
    required: false,
  })
  sku?: string;

  @ApiProperty({ example: 1, description: 'Entity type ID', required: false })
  entityTypeId?: number;

  @ApiProperty({
    example: 1,
    description: 'Publish status ID',
    required: false,
  })
  publishStatusId?: number;

  @ApiProperty({
    example: 1,
    description: 'Inventory status ID',
    required: false,
  })
  inventoryStatusId?: number;

  @ApiProperty({ example: 1, description: 'Brand ID', required: false })
  brandId?: number;
}
