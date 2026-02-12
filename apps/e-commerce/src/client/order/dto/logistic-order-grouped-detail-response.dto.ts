import { ApiProperty } from '@nestjs/swagger';
import { ClientOrderProductResponseDto } from './product-response.dto';
import { ClientOrderVendorResponseDto } from './vendor-response.dto';
import { DiscountResponseDto } from './discount-response.dto';

export class LogisticOrderGroupedDetailResponseDto {
  @ApiProperty({ example: 1, description: 'Detail ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Grouped ID' })
  groupedId: bigint;

  @ApiProperty({
    example: 1,
    description: 'Order detail status ID',
    required: false,
  })
  orderDetailStatusId?: number;

  @ApiProperty({ example: 1, description: 'Vendor ID', required: false })
  vendorId?: number;

  @ApiProperty({ example: 1, description: 'Product ID', required: false })
  productId?: bigint;

  @ApiProperty({ example: 1, description: 'Inventory ID', required: false })
  inventoryId?: bigint;

  @ApiProperty({ example: 2, description: 'Quantity' })
  qty: number;

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
    type: () => ClientOrderVendorResponseDto,
    description: 'Vendor details',
    required: false,
  })
  vendor?: ClientOrderVendorResponseDto;

  @ApiProperty({
    type: () => ClientOrderProductResponseDto,
    description: 'Product details',
    required: false,
  })
  product?: ClientOrderProductResponseDto;

  @ApiProperty({
    type: () => DiscountResponseDto,
    description: 'Discount details',
    required: false,
  })
  discount?: DiscountResponseDto;
}
