import { InventoryPriceDto } from '@rahino/ecommerce/inventory/dto/inventory-price.dto';
import { ProductPriceDto } from './ProductPriceDto.type';

export interface ICalPrice {
  getPrice(
    productDto: ProductPriceDto,
    inventoryPriceDto: InventoryPriceDto,
    inventoryWeight?: number,
  ): Promise<InventoryPriceDto>;
}
