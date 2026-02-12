import { ApiProperty } from '@nestjs/swagger';

export class ProductCommentProductResponseDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: bigint;

  @ApiProperty({ example: 'Product Title', description: 'Product title' })
  title: string;

  @ApiProperty({
    example: 'SKU-001',
    description: 'Product SKU',
    required: false,
  })
  sku?: string;
}
