import { ECProduct } from '@rahino/localdatabase/models';

export class ShoppingCartProductDto {
  id: bigint;
  shoppingCartId: bigint;
  productId: bigint;
  inventoryId: bigint;
  qty: number;
  product?: ECProduct;
}
