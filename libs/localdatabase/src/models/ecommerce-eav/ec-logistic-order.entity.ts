import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ECOrderStatus } from './ec-order-status.entity';
import { User } from '@rahino/database';
import { ECAddress } from './ec-address.entity';
import { ECPayment } from './ec-payment-entity';
import { ECLogisticOrderGrouped } from './ec-logistic-order-grouped.entity';

@Table({ tableName: 'ECLogisticOrders' })
export class ECLogisticOrder extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: bigint;

  @Column({ type: DataType.BIGINT, allowNull: true })
  totalProductPrice?: bigint;

  @Column({ type: DataType.BIGINT, allowNull: true })
  totalDiscountFee?: bigint;

  @Column({ type: DataType.BIGINT, allowNull: true })
  totalShipmentPrice?: bigint;

  @Column({ type: DataType.BIGINT, allowNull: true })
  realShipmentPrice?: bigint;

  @Column({ type: DataType.BIGINT, allowNull: true })
  totalPrice?: bigint;

  @Column({ type: DataType.INTEGER })
  @ForeignKey(() => ECOrderStatus)
  orderStatusId: number;

  @BelongsTo(() => ECOrderStatus, {
    as: 'orderStatus',
    foreignKey: 'orderStatusId',
  })
  orderStatus?: ECOrderStatus;

  @Column({ type: DataType.STRING })
  sessionId: string;

  @Column({ type: DataType.BIGINT })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({ type: DataType.BIGINT, allowNull: true })
  @ForeignKey(() => ECAddress)
  addressId?: bigint;

  @BelongsTo(() => ECAddress, { as: 'address', foreignKey: 'addressId' })
  address?: ECAddress;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  isDeleted?: boolean;

  @HasMany(() => ECLogisticOrderGrouped, {
    as: 'groups',
    foreignKey: 'logisticOrderId',
  })
  groups?: ECLogisticOrderGrouped[];

  @Column({ type: DataType.STRING, allowNull: true })
  postReceipt?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  transactionId?: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  @ForeignKey(() => ECPayment)
  paymentId?: bigint;

  @BelongsTo(() => ECPayment, { as: 'payment', foreignKey: 'paymentId' })
  payment?: ECPayment;

  @Column({ type: DataType.STRING, allowNull: true })
  gregorianAtPersian?: string;

  @Column({ type: DataType.BIGINT, allowNull: true })
  paymentCommissionAmount?: bigint;

  @Column({ type: DataType.STRING, allowNull: true })
  noteDescription?: string;
}
