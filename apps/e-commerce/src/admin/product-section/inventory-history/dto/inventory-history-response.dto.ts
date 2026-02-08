import { ApiProperty } from '@nestjs/swagger';

export class InventoryTrackStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Track Status ID' })
  id: number;

  @ApiProperty({ example: 'Added', description: 'Status name' })
  name: string;
}

export class InventoryHistoryProductResponseDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: bigint;

  @ApiProperty({ example: 'iPhone 15', description: 'Product title' })
  title: string;

  @ApiProperty({ example: 'SKU-12345', description: 'SKU', required: false })
  sku?: string;

  @ApiProperty({ example: 'iphone-15', description: 'URL slug' })
  slug: string;
}

export class InventoryHistoryResponseDto {
  @ApiProperty({ example: 1, description: 'Inventory History ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Inventory ID' })
  inventoryId: bigint;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({ example: 1, description: 'Inventory Track Change Status ID' })
  inventoryTrackChangeStatusId: number;

  @ApiProperty({ example: 10, description: 'Quantity' })
  qty: number;

  @ApiProperty({ example: 1, description: 'Order ID', required: false })
  orderId?: bigint;

  @ApiProperty({
    example: 1,
    description: 'Logistic Order ID',
    required: false,
  })
  logisticOrderId?: bigint;

  @ApiProperty({
    description: 'Inventory track status',
    type: () => InventoryTrackStatusResponseDto,
    required: false,
  })
  inventoryTrackStatus?: InventoryTrackStatusResponseDto;

  @ApiProperty({
    description: 'Product info',
    type: () => InventoryHistoryProductResponseDto,
    required: false,
  })
  product?: InventoryHistoryProductResponseDto;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}
