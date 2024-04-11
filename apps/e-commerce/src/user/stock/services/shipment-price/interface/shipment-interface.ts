import { StockPriceInterface } from '../../price';

export interface ShipmentInteface {
  cal(stockPrices: StockPriceInterface[], addressId?: bigint): Promise<bigint>;
}
