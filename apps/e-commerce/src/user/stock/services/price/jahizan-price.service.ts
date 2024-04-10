import { Injectable } from '@nestjs/common';
import { CalPriceInterface, TotalPriceInterface } from './interface';
import { ECStock } from '@rahino/database/models/ecommerce-eav/ec-stocks.entity';
import { StockPriceDto } from '../../dto';
import { GeneralPrice } from './general-price.service';

@Injectable()
export class JahizanPrice implements CalPriceInterface {
  constructor(private readonly generalPriceService: GeneralPrice) {}
  async cal(
    stocks: ECStock[],
    stockPrice: StockPriceDto,
    variationPriceId: number,
  ): Promise<TotalPriceInterface> {
    return await this.generalPriceService.cal(
      stocks,
      stockPrice,
      variationPriceId,
    );
  }
}
