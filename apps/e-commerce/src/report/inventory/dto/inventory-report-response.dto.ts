import { ApiProperty } from '@nestjs/swagger';

export class InventoryReportResponseDto {
  @ApiProperty({ example: 1, description: 'Inventory ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({ example: 1, description: 'Color ID', required: false })
  colorId?: number;

  @ApiProperty({ example: 1, description: 'Guarantee ID', required: false })
  guaranteeId?: number;

  @ApiProperty({ example: 1, description: 'Inventory status ID' })
  inventoryStatusId: number;

  @ApiProperty({ example: 100, description: 'Quantity' })
  qty: number;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Updated at',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Inventory status details',
    type: 'object',
    required: false,
  })
  inventoryStatus?: any;

  @ApiProperty({
    description: 'Product details',
    type: 'object',
    required: false,
  })
  product?: any;

  @ApiProperty({
    description: 'Color details',
    type: 'object',
    required: false,
  })
  color?: any;

  @ApiProperty({
    description: 'Guarantee details',
    type: 'object',
    required: false,
  })
  guarantee?: any;
}
