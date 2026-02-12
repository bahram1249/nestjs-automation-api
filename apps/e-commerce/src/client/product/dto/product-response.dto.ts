import { ApiProperty } from '@nestjs/swagger';
import { ClientProductBrandResponseDto } from './brand-response.dto';
import { PublishStatusResponseDto } from './publish-status-response.dto';
import { InventoryStatusResponseDto } from './inventory-status-response.dto';
import { EntityTypeResponseDto } from './entity-type-response.dto';
import { InventoryResponseDto } from './inventory-response.dto';
import { ClientProductAttachmentResponseDto } from './attachment-response.dto';

export class ClientProductResponseDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: bigint;

  @ApiProperty({ example: 'Product Title', description: 'Product title' })
  title: string;

  @ApiProperty({ example: 'product-slug', description: 'Product slug' })
  slug: string;

  @ApiProperty({
    example: 'SKU-001',
    description: 'Product SKU',
    required: false,
  })
  sku?: string;

  @ApiProperty({ example: 1, description: 'Entity Type ID', required: false })
  entityTypeId?: number;

  @ApiProperty({
    example: 1,
    description: 'Publish Status ID',
    required: false,
  })
  publishStatusId?: number;

  @ApiProperty({
    example: 1,
    description: 'Inventory Status ID',
    required: false,
  })
  inventoryStatusId?: number;

  @ApiProperty({ example: 1, description: 'Brand ID', required: false })
  brandId?: number;

  @ApiProperty({
    example: true,
    description: 'Is color based product',
    required: false,
  })
  colorBased?: boolean;

  @ApiProperty({
    example: 'Product description',
    description: 'Product description',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 100, description: 'View count' })
  viewCount: bigint;

  @ApiProperty({ example: 1, description: 'User ID', required: false })
  userId?: bigint;

  @ApiProperty({
    example: 'Meta Title',
    description: 'Meta title',
    required: false,
  })
  metaTitle?: string;

  @ApiProperty({
    example: 'meta, keywords',
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

  @ApiProperty({ example: 1.5, description: 'Product weight', required: false })
  weight?: number;

  @ApiProperty({ example: 4.5, description: 'Product score', required: false })
  score?: number;

  @ApiProperty({ example: 10, description: 'Comment count', required: false })
  cntComment?: number;

  @ApiProperty({
    example: 1,
    description: 'Product Formula ID',
    required: false,
  })
  productFormulaId?: number;

  @ApiProperty({ example: 5, description: 'Product wages', required: false })
  wages?: number;

  @ApiProperty({ example: 10000, description: 'Stone money', required: false })
  stoneMoney?: bigint;

  @ApiProperty({ example: 50000, description: 'Last price', required: false })
  lastPrice?: bigint;

  @ApiProperty({
    type: () => ClientProductBrandResponseDto,
    description: 'Brand details',
    required: false,
  })
  brand?: ClientProductBrandResponseDto;

  @ApiProperty({
    type: () => PublishStatusResponseDto,
    description: 'Publish status details',
    required: false,
  })
  publishStatus?: PublishStatusResponseDto;

  @ApiProperty({
    type: () => InventoryStatusResponseDto,
    description: 'Inventory status details',
    required: false,
  })
  inventoryStatus?: InventoryStatusResponseDto;

  @ApiProperty({
    type: () => EntityTypeResponseDto,
    description: 'Entity type details',
    required: false,
  })
  entityType?: EntityTypeResponseDto;

  @ApiProperty({
    type: () => [InventoryResponseDto],
    description: 'Product inventories',
    required: false,
  })
  inventories?: InventoryResponseDto[];

  @ApiProperty({
    type: () => [ClientProductAttachmentResponseDto],
    description: 'Product attachments',
    required: false,
  })
  attachments?: ClientProductAttachmentResponseDto[];

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Created at timestamp',
    required: false,
  })
  createdAt?: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Updated at timestamp',
    required: false,
  })
  updatedAt?: Date;
}
