import { ShoppingCartProductDto } from './shopping-cart-product.dto';
import { ShoppingCartShippingWayDto } from './shopping-cart-shipping-way.dto';
import { ShoppingCartVendorDto } from './shopping-cart-vendor.dto';

export class ShoppingCartDto {
  id: bigint;
  sessionId: string;
  expire?: Date;

  vendorId?: number;

  vendor?: ShoppingCartVendorDto;

  shippingWayId: number;

  shippingWay?: ShoppingCartShippingWayDto;

  shoppingProducts?: ShoppingCartProductDto[];
}
