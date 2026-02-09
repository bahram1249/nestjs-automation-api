import { ApiProperty } from '@nestjs/swagger';
import { AdminOrderVendorResponseDto } from './vendor-response.dto';
import { AdminOrderProductResponseDto } from './product-response.dto';
import { OrderDetailStatusResponseDto } from './order-detail-status-response.dto';
import { DiscountResponseDto } from './discount-response.dto';

export class OrderDetailResponseDto {
  @ApiProperty({ example: 1, description: 'Order Detail ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Order ID' })
  orderId: bigint;

  @ApiProperty({ example: 1, description: 'Order Detail Status ID' })
  orderDetailStatusId: number;

  @ApiProperty({ example: 1, description: 'Vendor ID' })
  vendorId: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({ example: 1, description: 'Inventory ID' })
  inventoryId: bigint;

  @ApiProperty({ example: 2, description: 'Quantity', required: false })
  qty?: number;

  @ApiProperty({
    example: 100000,
    description: 'Product price',
    required: false,
  })
  productPrice?: bigint;

  @ApiProperty({ example: 10000, description: 'Discount fee', required: false })
  discountFee?: bigint;

  @ApiProperty({
    example: 5000,
    description: 'Discount fee per item',
    required: false,
  })
  discountFeePerItem?: bigint;

  @ApiProperty({ example: 1, description: 'Discount ID', required: false })
  discountId?: bigint;

  @ApiProperty({ example: 90000, description: 'Total price', required: false })
  totalPrice?: bigint;

  @ApiProperty({ example: 1, description: 'User ID', required: false })
  userId?: bigint;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Updated at',
  })
  updatedAt: Date;

  @ApiProperty({
    type: () => AdminOrderVendorResponseDto,
    description: 'Vendor details',
    required: false,
  })
  vendor?: AdminOrderVendorResponseDto;

  @ApiProperty({
    type: () => OrderDetailStatusResponseDto,
    description: 'Order detail status',
    required: false,
  })
  orderDetailStatus?: OrderDetailStatusResponseDto;

  @ApiProperty({
    type: () => AdminOrderProductResponseDto,
    description: 'Product details',
    required: false,
  })
  product?: AdminOrderProductResponseDto;

  @ApiProperty({
    type: () => DiscountResponseDto,
    description: 'Discount details',
    required: false,
  })
  discount?: DiscountResponseDto;
}
