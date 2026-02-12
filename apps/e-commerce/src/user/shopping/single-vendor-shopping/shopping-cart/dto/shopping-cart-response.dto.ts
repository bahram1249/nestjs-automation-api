import { ApiProperty } from '@nestjs/swagger';
import { ShoppingCartProductResponseDto } from './shopping-cart-product-response.dto';
import { ShoppingCartVendorResponseDto } from './shopping-cart-vendor-response.dto';
import { ShoppingCartShippingWayResponseDto } from './shopping-cart-shipping-way-response.dto';

export class ShoppingCartResponseDto {
  @ApiProperty({ example: 1, description: 'Shopping cart ID' })
  id: bigint;

  @ApiProperty({ example: 'session-123', description: 'Session ID' })
  sessionId: string;

  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    description: 'Expiration date',
    required: false,
  })
  expire?: Date;

  @ApiProperty({ example: 1, description: 'Vendor ID', required: false })
  vendorId?: number;

  @ApiProperty({
    description: 'Vendor details',
    required: false,
    type: ShoppingCartVendorResponseDto,
  })
  vendor?: ShoppingCartVendorResponseDto;

  @ApiProperty({ example: 1, description: 'Shipping way ID' })
  shippingWayId: number;

  @ApiProperty({
    description: 'Shipping way details',
    required: false,
    type: ShoppingCartShippingWayResponseDto,
  })
  shippingWay?: ShoppingCartShippingWayResponseDto;

  @ApiProperty({
    description: 'Shopping cart products',
    required: false,
    type: [ShoppingCartProductResponseDto],
  })
  shoppingProducts?: ShoppingCartProductResponseDto[];
}
