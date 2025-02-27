import { ECVariationPrice } from '@rahino/localdatabase/models';
import { StockPriceInterface } from './stock-price.interface';

export interface VariationStockInterface {
  stocks: StockPriceInterface[];
  variationPrice: ECVariationPrice;
}
