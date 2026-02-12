import { ApiProperty } from '@nestjs/swagger';

export class StockDeleteResponseDto {
  @ApiProperty({ example: 1, description: 'Deleted stock ID' })
  id: bigint;

  @ApiProperty({ example: 'session-123', description: 'Session ID' })
  sessionId: string;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({ example: 1, description: 'Inventory ID' })
  inventoryId: bigint;

  @ApiProperty({ example: 2, description: 'Quantity' })
  qty: number;

  @ApiProperty({ example: true, description: 'Whether the stock is deleted' })
  isDeleted: boolean;
}
