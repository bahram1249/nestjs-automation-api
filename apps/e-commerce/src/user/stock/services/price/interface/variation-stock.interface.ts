import { ECVariationPrice } from '@rahino/database';
import { StockPriceInterface } from './stock-price.interface';

export interface VariationStockInterface {
  stocks: StockPriceInterface[];
  variationPrice: ECVariationPrice;
}
