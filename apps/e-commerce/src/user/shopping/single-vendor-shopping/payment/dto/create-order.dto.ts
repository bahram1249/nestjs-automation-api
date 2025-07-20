import { OrderShipmentwayEnum } from '@rahino/ecommerce/shared/enum';
import { Transaction } from 'sequelize';

export class SingleVendorShoppingCreateOrderDto {
  totalPrice: number;
  totalDiscount: number;
  totalProductPrice: number;
  totalShipmentPrice: number;
  realShipmentPrice: number;
  shipmentWay: OrderShipmentwayEnum;
  sessionId: string;
  userId: bigint;
  addressId: bigint;
  noteDescription?: string;
  transaction?: Transaction;
}
