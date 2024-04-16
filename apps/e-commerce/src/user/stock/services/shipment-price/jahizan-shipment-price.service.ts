import { Injectable } from '@nestjs/common';
import { StockPriceInterface } from '../price';
import { ShipmentInteface } from './interface';
import { PostShipmentPriceService } from './post-shipment-price.service';
import { OrderShipmentwayEnum } from '@rahino/ecommerce/util/enum';

@Injectable()
export class JahizanShipmentPrice implements ShipmentInteface {
  constructor(private readonly postShipmentService: PostShipmentPriceService) {}
  async cal(
    stockPrices: StockPriceInterface[],
    addressId?: bigint,
  ): Promise<{ type: OrderShipmentwayEnum; price: number }> {
    return await this.postShipmentService.cal(stockPrices, addressId);
  }
}
