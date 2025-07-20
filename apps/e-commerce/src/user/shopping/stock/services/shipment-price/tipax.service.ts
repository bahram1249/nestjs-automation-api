import { Injectable } from '@nestjs/common';
import { StockPriceInterface } from '../price';
import { ShipmentInteface } from './interface';
import { OrderShipmentwayEnum } from '@rahino/ecommerce/shared/enum';

@Injectable()
export class TipaxShipmentPrice implements ShipmentInteface {
  constructor() {}
  async cal(
    stockPrices: StockPriceInterface[],
    addressId?: bigint,
  ): Promise<{
    type: OrderShipmentwayEnum;
    typeName: string;
    price: number;
    realShipmentPrice: number;
  }> {
    return {
      type: OrderShipmentwayEnum.tipax,
      typeName: 'تیپاکس(پس کرایه)',
      price: 0,
      realShipmentPrice: 0,
    };
  }
}
