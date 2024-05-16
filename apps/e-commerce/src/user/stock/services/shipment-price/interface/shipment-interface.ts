import { OrderShipmentwayEnum } from '@rahino/ecommerce/util/enum';
import { StockPriceInterface } from '../../price';

export interface ShipmentInteface {
  cal(
    stockPrices: StockPriceInterface[],
    addressId?: bigint,
  ): Promise<{
    type: OrderShipmentwayEnum;
    price: number;
    realShipmentPrice: number;
  }>;
}
