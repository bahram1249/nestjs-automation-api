import { ProductDto } from '../../dto';
import { InventoryPriceDto } from '@rahino/ecommerce/inventory/dto/inventory-price.dto';

export interface ICalPrice {
  getPrice(
    productDto: Pick<
      ProductDto,
      'weight' | 'productFormulaId' | 'wages' | 'stoneMoney'
    >,
    inventoryPriceDto: InventoryPriceDto,
  ): Promise<InventoryPriceDto>;
}
