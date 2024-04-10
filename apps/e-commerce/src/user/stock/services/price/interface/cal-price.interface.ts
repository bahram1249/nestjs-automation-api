import { ECStock } from '@rahino/database/models/ecommerce-eav/ec-stocks.entity';
import { TotalPriceInterface } from './total-price.interface';
import { StockPriceDto } from '../../../dto';

export interface CalPriceInterface {
  cal(
    stocks: ECStock[],
    stockPrice: StockPriceDto,
    variationPriceId: number,
  ): Promise<TotalPriceInterface>;
}
