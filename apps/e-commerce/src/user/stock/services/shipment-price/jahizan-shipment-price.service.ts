import { Injectable } from '@nestjs/common';
import { StockPriceInterface } from '../price';
import { ShipmentInteface } from './interface';
import { PostShipmentPriceService } from './post-shipment-price.service';

@Injectable()
export class JahizanShipmentPrice implements ShipmentInteface {
  constructor(private readonly postShipmentService: PostShipmentPriceService) {}
  async cal(stockPrices: StockPriceInterface[], addressId?: bigint) {
    return await this.postShipmentService.cal(stockPrices, addressId);
  }
}
