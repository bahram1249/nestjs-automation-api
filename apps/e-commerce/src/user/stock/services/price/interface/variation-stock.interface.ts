import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { StockPriceInterface } from './stock-price.interface';

export interface VariationStockInterface {
  stocks: StockPriceInterface[];
  variationPrice: ECVariationPrice;
}
