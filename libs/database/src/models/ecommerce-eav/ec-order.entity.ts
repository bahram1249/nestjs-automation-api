import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ECOrderShipmentWay } from './ec-order-shipmentway.entity';
import { ECOrderStatus } from './ec-order-status.entity';
import { User } from '../core/user.entity';
import { ECAddress } from './ec-address.entity';
import { ECOrderDetail } from './ec-order-detail.entity';
import { ECPayment } from './ec-payment-entity';
import { ECPaymentGateway } from './ec-payment-gateway.entity';

@Table({ tableName: 'ECOrders' })
export class ECOrder extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  totalProductPrice?: bigint;
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  totalDiscountFee?: bigint;
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  totalShipmentPrice?: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  realShipmentPrice?: bigint;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECOrderShipmentWay)
  orderShipmentWayId?: number;

  @BelongsTo(() => ECOrderShipmentWay, {
    as: 'orderShipmentWay',
    foreignKey: 'orderShipmentWayId',
  })
  orderShipmentWay?: ECOrderShipmentWay;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  totalPrice?: bigint;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECOrderStatus)
  orderStatusId: number;

  @BelongsTo(() => ECOrderStatus, {
    as: 'orderStatus',
    foreignKey: 'orderStatusId',
  })
  orderStatus?: ECOrderStatus;

  @Column({
    type: DataType.STRING,
  })
  sessionId: string;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => ECAddress)
  addressId?: bigint;

  @BelongsTo(() => ECAddress, { as: 'address', foreignKey: 'addressId' })
  address?: ECAddress;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @HasMany(() => ECOrderDetail, { as: 'details', foreignKey: 'orderId' })
  details?: ECOrderDetail[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  postReceipt?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  transactionId?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => ECPayment)
  paymentId?: bigint;

  @BelongsTo(() => ECPayment, { as: 'payment', foreignKey: 'paymentId' })
  payment?: ECPayment;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  courierUserId?: bigint;

  @BelongsTo(() => User, { as: 'courierUser', foreignKey: 'courierUserId' })
  courierUser?: User;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  deliveryDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  sendToCustomerDate?: Date;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  sendToCustomerBy?: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  gregorianAtPersian?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  paymentCommissionAmount?: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  noteDescription?: string;
}
