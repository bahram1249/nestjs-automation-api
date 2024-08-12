import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';

export interface ICalPrice {
  getPrice(product: ECProduct, inventory: ECInventory);
}
