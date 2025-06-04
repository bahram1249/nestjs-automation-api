import { ECProduct } from '@rahino/localdatabase/models';

export class ShoppingCartProductDto {
  id: bigint;
  productId: bigint;
  inventoryId: bigint;
  qty: number;
  product?: ECProduct;
}
