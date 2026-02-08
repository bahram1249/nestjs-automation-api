import { ApiProperty } from '@nestjs/swagger';

export class BasedProductSaleResponseDto {
  @ApiProperty({ example: 1, description: 'Vendor ID' })
  vendorId: number;

  @ApiProperty({ example: 1, description: 'Product ID' })
  productId: bigint;

  @ApiProperty({ example: 'Product Title', description: 'Product title' })
  productTitle: string;

  @ApiProperty({ example: 'SKU-001', description: 'Product SKU' })
  productSku: string;

  @ApiProperty({ example: 'product-slug', description: 'Product slug' })
  productSlug: string;

  @ApiProperty({ example: 'Vendor Name', description: 'Vendor name' })
  vendorName: string;

  @ApiProperty({ example: 'vendor-slug', description: 'Vendor slug' })
  vendorSlug: string;

  @ApiProperty({ example: 100, description: 'Total quantity sold' })
  qty: number;

  @ApiProperty({
    description: 'Product details',
    type: 'object',
    required: false,
  })
  product?: any;

  @ApiProperty({
    description: 'Vendor details',
    type: 'object',
    required: false,
  })
  vendor?: any;
}
