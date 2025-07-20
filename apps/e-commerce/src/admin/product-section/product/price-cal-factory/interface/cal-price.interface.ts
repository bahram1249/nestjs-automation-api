import { InventoryPriceDto } from '@rahino/ecommerce/shared/inventory/dto/inventory-price.dto';
import { ProductPriceDto } from './ProductPriceDto.type';
import { InventoryPriceIncludeBuyPriceDto } from './inventory-price-include-buy-price.dto';

export interface ICalPrice {
  getPrice(
    productDto: ProductPriceDto,
    inventoryPriceDto: InventoryPriceDto,
    buyPrice?: bigint,
    inventoryWeight?: number,
  ): Promise<InventoryPriceIncludeBuyPriceDto>;
}
