import { ApiProperty } from '@nestjs/swagger';

export class ReportProductAttachmentResponseDto {
  @ApiProperty({ example: 1, description: 'Attachment ID' })
  id: bigint;

  @ApiProperty({ example: 'image.jpg', description: 'File name' })
  fileName: string;
}

export class ReportProductResponseDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: bigint;

  @ApiProperty({ example: 'Product Title', description: 'Product title' })
  title: string;

  @ApiProperty({ example: 'SKU-001', description: 'Product SKU' })
  sku: string;

  @ApiProperty({
    example: 'product-slug',
    description: 'Product slug',
    required: false,
  })
  slug?: string;

  @ApiProperty({
    description: 'Product attachments',
    type: () => [ReportProductAttachmentResponseDto],
    required: false,
  })
  attachments?: ReportProductAttachmentResponseDto[];
}

export class ReportInventoryPriceResponseDto {
  @ApiProperty({ example: 1, description: 'Inventory price ID' })
  id: bigint;

  @ApiProperty({ example: 100000, description: 'Buy price' })
  buyPrice: number;

  @ApiProperty({ example: 1, description: 'Variation price ID' })
  variationPriceId: number;
}

export class ReportVendorResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor ID' })
  id: number;

  @ApiProperty({ example: 'Vendor Name', description: 'Vendor name' })
  name: string;

  @ApiProperty({
    example: 'vendor-slug',
    description: 'Vendor slug',
    required: false,
  })
  slug?: string;
}

export class ReportColorResponseDto {
  @ApiProperty({ example: 1, description: 'Color ID' })
  id: number;

  @ApiProperty({ example: 'Red', description: 'Color name' })
  name: string;
}

export class ReportGuaranteeResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee ID' })
  id: number;

  @ApiProperty({ example: 'Guarantee Name', description: 'Guarantee name' })
  name: string;
}

export class ReportGuaranteeMonthResponseDto {
  @ApiProperty({ example: 1, description: 'Guarantee month ID' })
  id: number;

  @ApiProperty({ example: '12 Months', description: 'Guarantee month name' })
  name: string;
}

export class ReportInventoryResponseDto {
  @ApiProperty({ example: 1, description: 'Inventory ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Vendor ID' })
  vendorId: number;

  @ApiProperty({ example: 1, description: 'Color ID', required: false })
  colorId?: number;

  @ApiProperty({ example: 1, description: 'Guarantee ID', required: false })
  guaranteeId?: number;

  @ApiProperty({
    example: 1,
    description: 'Guarantee month ID',
    required: false,
  })
  guaranteeMonthId?: number;

  @ApiProperty({
    description: 'Inventory vendor details',
    type: () => ReportVendorResponseDto,
    required: false,
  })
  vendor?: ReportVendorResponseDto;

  @ApiProperty({
    description: 'Inventory color details',
    type: () => ReportColorResponseDto,
    required: false,
  })
  color?: ReportColorResponseDto;

  @ApiProperty({
    description: 'Inventory guarantee details',
    type: () => ReportGuaranteeResponseDto,
    required: false,
  })
  guarantee?: ReportGuaranteeResponseDto;

  @ApiProperty({
    description: 'Inventory guarantee month details',
    type: () => ReportGuaranteeMonthResponseDto,
    required: false,
  })
  guaranteeMonth?: ReportGuaranteeMonthResponseDto;
}

export class ReportOrderStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Order status ID' })
  id: number;

  @ApiProperty({ example: 'Paid', description: 'Order status name' })
  name: string;
}

export class ReportCourierUserResponseDto {
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

export class ReportInventoryStatusResponseDto {
  @ApiProperty({ example: 1, description: 'Inventory status ID' })
  id: number;

  @ApiProperty({ example: 'Available', description: 'Inventory status name' })
  name: string;
}

export class ReportPaymentGatewayResponseDto {
  @ApiProperty({ example: 1, description: 'Payment gateway ID' })
  id: number;

  @ApiProperty({ example: 'ZarinPal', description: 'Payment gateway name' })
  name: string;
}

export class ReportPaymentResponseDto {
  @ApiProperty({ example: 1, description: 'Payment ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Payment gateway ID' })
  paymentGatewayId: number;

  @ApiProperty({ example: 1, description: 'Payment status ID' })
  paymentStatusId: number;

  @ApiProperty({
    description: 'Payment gateway details',
    type: () => ReportPaymentGatewayResponseDto,
    required: false,
  })
  paymentGateway?: ReportPaymentGatewayResponseDto;
}
