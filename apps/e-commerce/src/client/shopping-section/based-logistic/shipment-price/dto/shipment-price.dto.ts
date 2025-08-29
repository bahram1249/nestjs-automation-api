import { OrderShipmentwayEnum } from '@rahino/ecommerce/shared/enum';

export interface ShipmentStockInput {
  weight?: number;
  qty?: number;
  freeShipment?: boolean;
  totalPrice?: number;
}

export interface ShipmentPriceResult {
  type: OrderShipmentwayEnum;
  typeName: string;
  price: number;
  realShipmentPrice: number;
}
