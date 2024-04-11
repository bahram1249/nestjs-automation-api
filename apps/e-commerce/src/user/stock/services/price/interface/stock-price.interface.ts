import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';

export interface StockPriceInterface {
  stockId: bigint;
  productId: bigint;
  inventoryId: bigint;
  variationPrice: ECVariationPrice;
  basePrice?: number;
  afterDiscount?: number;
  discountId?: bigint;
  couponCode?: string;
  totalPrice?: number;
  discountFee?: number;
  totalProductPrice?: number;
  qty?: number;
  error?: number;
  weight?: number;
}
