import { ApiProperty } from '@nestjs/swagger';

export class LogisticOrderStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Order Status ID' })
  id: number;

  @ApiProperty({ example: 'Paid', description: 'Status name' })
  name: string;
}

export class LogisticOrderUserResponseDto {
  @ApiProperty({ example: 1, description: 'User ID' })
  id: bigint;

  @ApiProperty({ example: 'John', description: 'First name', required: false })
  firstname?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name', required: false })
  lastname?: string;

  @ApiProperty({ example: 'johndoe', description: 'Username', required: false })
  username?: string;

  @ApiProperty({
    example: '09123456789',
    description: 'Phone number',
    required: false,
  })
  phoneNumber?: string;
}

export class LogisticOrderAddressResponseDto {
  @ApiProperty({ example: 1, description: 'Address ID' })
  id: bigint;

  @ApiProperty({ example: 'Tehran', description: 'City', required: false })
  city?: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'Address',
    required: false,
  })
  address?: string;

  @ApiProperty({
    example: '12345',
    description: 'Postal code',
    required: false,
  })
  postalCode?: string;
}

export class LogisticOrderDetailStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Detail Status ID' })
  id: number;

  @ApiProperty({ example: 'Processed', description: 'Status name' })
  name: string;
}

export class LogisticOrderVendorResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor ID' })
  id: number;

  @ApiProperty({ example: 'Vendor Name', description: 'Vendor name' })
  name: string;
}

export class LogisticOrderProductResponseDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: bigint;

  @ApiProperty({ example: 'iPhone 15', description: 'Product title' })
  title: string;

  @ApiProperty({ example: 'SKU-12345', description: 'SKU', required: false })
  sku?: string;

  @ApiProperty({ example: 'iphone-15', description: 'URL slug' })
  slug: string;
}

export class LogisticOrderDetailResponseDto {
  @ApiProperty({ example: 1, description: 'Detail ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Order Detail Status ID' })
  orderDetailStatusId: number;

  @ApiProperty({ example: 1, description: 'Vendor ID' })
  vendorId: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({ example: 1, description: 'Inventory ID' })
  inventoryId: bigint;

  @ApiProperty({ example: 1, description: 'Quantity', required: false })
  qty?: number;

  @ApiProperty({
    example: 1000000,
    description: 'Product price',
    required: false,
  })
  productPrice?: bigint;

  @ApiProperty({
    example: 100000,
    description: 'Discount fee',
    required: false,
  })
  discountFee?: bigint;

  @ApiProperty({
    example: 100000,
    description: 'Discount fee per item',
    required: false,
  })
  discountFeePerItem?: bigint;

  @ApiProperty({ example: 900000, description: 'Total price', required: false })
  totalPrice?: bigint;

  @ApiProperty({
    description: 'Order detail status',
    type: () => LogisticOrderDetailStatusResponseDto,
    required: false,
  })
  orderDetailStatus?: LogisticOrderDetailStatusResponseDto;

  @ApiProperty({
    description: 'Vendor',
    type: () => LogisticOrderVendorResponseDto,
    required: false,
  })
  vendor?: LogisticOrderVendorResponseDto;

  @ApiProperty({
    description: 'Product',
    type: () => LogisticOrderProductResponseDto,
    required: false,
  })
  product?: LogisticOrderProductResponseDto;
}

export class LogisticOrderGroupedResponseDto {
  @ApiProperty({ example: 1, description: 'Grouped ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Logistic Order ID' })
  logisticOrderId: bigint;

  @ApiProperty({ example: 1, description: 'Logistic ID' })
  logisticId: bigint;

  @ApiProperty({ example: 1, description: 'Logistic Shipment Way ID' })
  logisticShipmentWayId: bigint;

  @ApiProperty({ example: 1, description: 'Order Status ID' })
  orderStatusId: number;

  @ApiProperty({
    example: 1000000,
    description: 'Total product price',
    required: false,
  })
  totalProductPrice?: bigint;

  @ApiProperty({
    example: 100000,
    description: 'Total discount fee',
    required: false,
  })
  totalDiscountFee?: bigint;

  @ApiProperty({
    example: 50000,
    description: 'Shipment price',
    required: false,
  })
  shipmentPrice?: bigint;

  @ApiProperty({ example: 950000, description: 'Total price', required: false })
  totalPrice?: bigint;

  @ApiProperty({
    example: 'POST-12345',
    description: 'Post receipt',
    required: false,
  })
  postReceipt?: string;

  @ApiProperty({ description: 'Delivery date', required: false })
  deliveryDate?: Date;

  @ApiProperty({
    description: 'Order status',
    type: () => LogisticOrderStatusResponseDto,
    required: false,
  })
  orderStatus?: LogisticOrderStatusResponseDto;

  @ApiProperty({
    description: 'Order details',
    type: () => LogisticOrderDetailResponseDto,
    isArray: true,
    required: false,
  })
  details?: LogisticOrderDetailResponseDto[];
}

export class LogisticPendingOrderResponseDto {
  @ApiProperty({ example: 1, description: 'Order ID' })
  id: bigint;

  @ApiProperty({
    example: 1000000,
    description: 'Total product price',
    required: false,
  })
  totalProductPrice?: bigint;

  @ApiProperty({
    example: 100000,
    description: 'Total discount fee',
    required: false,
  })
  totalDiscountFee?: bigint;

  @ApiProperty({
    example: 50000,
    description: 'Total shipment price',
    required: false,
  })
  totalShipmentPrice?: bigint;

  @ApiProperty({ example: 950000, description: 'Total price', required: false })
  totalPrice?: bigint;

  @ApiProperty({ example: 1, description: 'Order Status ID' })
  orderStatusId: number;

  @ApiProperty({ example: 'session-123', description: 'Session ID' })
  sessionId: string;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({ example: 1, description: 'Address ID', required: false })
  addressId?: bigint;

  @ApiProperty({
    example: 'POST-12345',
    description: 'Post receipt',
    required: false,
  })
  postReceipt?: string;

  @ApiProperty({
    description: 'Order status',
    type: () => LogisticOrderStatusResponseDto,
    required: false,
  })
  orderStatus?: LogisticOrderStatusResponseDto;

  @ApiProperty({
    description: 'User',
    type: () => LogisticOrderUserResponseDto,
    required: false,
  })
  user?: LogisticOrderUserResponseDto;

  @ApiProperty({
    description: 'Address',
    type: () => LogisticOrderAddressResponseDto,
    required: false,
  })
  address?: LogisticOrderAddressResponseDto;

  @ApiProperty({
    description: 'Order groups',
    type: () => LogisticOrderGroupedResponseDto,
    isArray: true,
    required: false,
  })
  groups?: LogisticOrderGroupedResponseDto[];
}

export class LogisticPendingOrderDetailResponseDto {
  @ApiProperty({ example: 1, description: 'Detail ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Order Detail Status ID' })
  orderDetailStatusId: number;

  @ApiProperty({ example: 1, description: 'Vendor ID' })
  vendorId: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({ example: 1, description: 'Quantity', required: false })
  qty?: number;

  @ApiProperty({
    description: 'Order detail status',
    type: () => LogisticOrderDetailStatusResponseDto,
    required: false,
  })
  orderDetailStatus?: LogisticOrderDetailStatusResponseDto;

  @ApiProperty({
    description: 'Vendor',
    type: () => LogisticOrderVendorResponseDto,
    required: false,
  })
  vendor?: LogisticOrderVendorResponseDto;

  @ApiProperty({
    description: 'Product',
    type: () => LogisticOrderProductResponseDto,
    required: false,
  })
  product?: LogisticOrderProductResponseDto;
}
