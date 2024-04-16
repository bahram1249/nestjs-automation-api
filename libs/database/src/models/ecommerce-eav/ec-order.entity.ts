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
    foreignKey: 'orerStatusId',
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
}
