import { ECVariationPrice } from '@rahino/localdatabase/models';

export interface StockPriceInterface {
  stockId: bigint;
  productId: bigint;
  inventoryId: bigint;
  variationPrice: ECVariationPrice;
  inventoryPriceId?: bigint;
  vendorId?: number;
  basePrice?: number;
  afterDiscount?: number;
  discountId?: bigint;
  couponCode?: string;
  totalPrice?: number;
  discountFeePerItem?: number;
  discountFee?: number;
  totalProductPrice?: number;
  freeShipment?: boolean;
  qty?: number;
  error?: number;
  weight?: number;
}
