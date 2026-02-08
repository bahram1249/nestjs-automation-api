import { ApiProperty } from '@nestjs/swagger';
import { InventoryResponseDto } from './inventory-response.dto';
import { AttachmentResponseDto } from './attachment-response.dto';

export class ProductResponseDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: bigint;

  @ApiProperty({ example: 'Product Title', description: 'Product title' })
  title: string;

  @ApiProperty({
    example: 'product-slug',
    description: 'Product slug',
    required: false,
  })
  slug?: string;

  @ApiProperty({
    example: 'SKU-001',
    description: 'Product SKU',
    required: false,
  })
  sku?: string;

  @ApiProperty({
    type: () => [InventoryResponseDto],
    description: 'Product inventories',
    required: false,
  })
  inventories?: InventoryResponseDto[];

  @ApiProperty({
    type: () => [AttachmentResponseDto],
    description: 'Product attachments',
    required: false,
  })
  attachments?: AttachmentResponseDto[];
}
