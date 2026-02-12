import { ApiProperty } from '@nestjs/swagger';

export class StockCreateResultDto {
  @ApiProperty({ example: 1, description: 'Stock ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Inventory ID' })
  inventoryId: bigint;

  @ApiProperty({ example: 2, description: 'Quantity' })
  qty: number;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Expiration date',
  })
  expire: Date;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;
}

export class StockCreateResponseDto {
  @ApiProperty({
    description: 'Result of stock creation job',
    type: () => StockCreateResultDto,
  })
  result: StockCreateResultDto;
}
