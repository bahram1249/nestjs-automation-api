export class FormatShoppingCartProductOutputDto {
  productId: bigint;
  inventoryId: bigint;
  vendorId: number;
  variationPriceId: number;
  qty: number;
  inventoryPriceId: bigint;
  shoppingCartId: bigint;
  shoppingCartProductId: bigint;
  discountId?: number;
  discountFeePerItem?: number;
  discountFee?: number;
  basePrice: number;
  totalProductPrice: number;
  totalPrice: number;
  afterDiscount: number;
  copunCode?: string;
  weight?: number;
}
