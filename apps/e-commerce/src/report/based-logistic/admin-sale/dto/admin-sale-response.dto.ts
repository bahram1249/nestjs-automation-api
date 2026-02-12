import { ApiProperty } from '@nestjs/swagger';
import {
  ReportProductResponseDto,
  ReportInventoryResponseDto,
  ReportVendorResponseDto,
} from '../../../dto/report-shared-response.dto';

export class BasedAdminSaleResponseDto {
  @ApiProperty({ example: 1, description: 'Order grouped detail ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Grouped ID' })
  groupedId: bigint;

  @ApiProperty({ example: 1, description: 'Order detail status ID' })
  orderDetailStatusId: number;

  @ApiProperty({ example: 1, description: 'Vendor ID' })
  vendorId: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({ example: 1, description: 'Inventory ID' })
  inventoryId: bigint;

  @ApiProperty({ example: 2, description: 'Quantity' })
  qty: number;

  @ApiProperty({ example: 100000, description: 'Buy price', required: false })
  buyPrice?: number;

  @ApiProperty({ example: 150000, description: 'Unit price', required: false })
  unitPrice?: number;

  @ApiProperty({
    example: 300000,
    description: 'Product price',
    required: false,
  })
  productPrice?: number;

  @ApiProperty({ example: 10000, description: 'Discount fee', required: false })
  discountFee?: number;

  @ApiProperty({ example: 290000, description: 'Total price', required: false })
  totalPrice?: number;

  @ApiProperty({
    example: 5000,
    description: 'Commission amount',
    required: false,
  })
  commissionAmount?: number;

  @ApiProperty({
    example: 285000,
    description: 'Vendor revenue',
    required: false,
  })
  vendorRevenue?: number;

  @ApiProperty({
    example: 185000,
    description: 'Profit amount',
    required: false,
  })
  profitAmount?: number;

  @ApiProperty({
    description: 'Product details',
    type: () => ReportProductResponseDto,
    required: false,
  })
  product?: ReportProductResponseDto;

  @ApiProperty({
    description: 'Inventory details',
    type: () => ReportInventoryResponseDto,
    required: false,
  })
  inventory?: ReportInventoryResponseDto;

  @ApiProperty({
    description: 'Vendor details',
    type: () => ReportVendorResponseDto,
    required: false,
  })
  vendor?: ReportVendorResponseDto;
}

export class BasedAdminSaleTotalResponseDto {
  @ApiProperty({ example: 10, description: 'Count of orders' })
  cntOrder: number;

  @ApiProperty({ example: 50, description: 'Total quantity' })
  qty: number;

  @ApiProperty({ example: 5000000, description: 'Total buy price' })
  buyPrice: number;

  @ApiProperty({ example: 7500000, description: 'Total product price' })
  productPrice: number;

  @ApiProperty({ example: 500000, description: 'Total discount fee' })
  discountFee: number;

  @ApiProperty({ example: 7000000, description: 'Total price' })
  totalPrice: number;

  @ApiProperty({ example: 350000, description: 'Total commission amount' })
  commissionAmount: number;

  @ApiProperty({ example: 6650000, description: 'Total vendor revenue' })
  vendorRevenue: number;

  @ApiProperty({ example: 1650000, description: 'Total profit amount' })
  profitAmount: number;
}
