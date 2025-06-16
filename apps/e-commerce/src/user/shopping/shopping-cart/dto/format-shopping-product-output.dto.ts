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
  discountFeePerItem?: bigint;
  discountFee?: number;
  basePrice: bigint;
  totalProductPrice: number;
  totalPrice: number;
  afterDiscount: bigint;
  copunCode?: string;
  weight?: number;
}
