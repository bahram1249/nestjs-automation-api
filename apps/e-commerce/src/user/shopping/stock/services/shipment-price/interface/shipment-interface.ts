import { OrderShipmentwayEnum } from '@rahino/ecommerce/shared/enum';
import { StockPriceInterface } from '../../price';

export interface ShipmentInteface {
  cal(
    stockPrices: StockPriceInterface[],
    addressId?: bigint,
  ): Promise<{
    type: OrderShipmentwayEnum;
    typeName: string;
    price: number;
    realShipmentPrice: number;
  }>;
}
