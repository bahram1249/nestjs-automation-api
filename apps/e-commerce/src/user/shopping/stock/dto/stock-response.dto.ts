import { ApiProperty } from '@nestjs/swagger';

export class StockResponseDto {
  @ApiProperty({ example: 1, description: 'Stock ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Inventory ID' })
  inventoryId: bigint;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({ example: 2, description: 'Quantity' })
  qty: number;

  @ApiProperty({
    description: 'Product details',
    required: false,
    type: Object,
  })
  product?: any;
}
