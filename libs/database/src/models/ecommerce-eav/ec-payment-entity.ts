import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECPaymentGateway } from './ec-payment-gateway.entity';
import { ECPaymentType } from './ec-payment-type.entity';
import { ECPaymentStatus } from './ec-payment-status.entity';
import { ECOrder } from './ec-order.entity';
import { User } from '../core/user.entity';

@Table({ tableName: 'ECPayments' })
export class ECPayment extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: bigint;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECPaymentGateway)
  paymentGatewayId: number;

  @BelongsTo(() => ECPaymentGateway, {
    as: 'paymentGateway',
    foreignKey: 'paymentGatewayId',
  })
  paymentGateway?: ECPaymentGateway;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECPaymentType)
  paymentTypeId: number;

  @BelongsTo(() => ECPaymentType, {
    as: 'paymentType',
    foreignKey: 'paymentTypeId',
  })
  paymentType?: ECPaymentType;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECPaymentStatus)
  paymentStatusId: number;

  @BelongsTo(() => ECPaymentStatus, {
    as: 'paymentStatus',
    foreignKey: 'paymentStatusId',
  })
  paymentStatus?: ECPaymentStatus;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  totalprice?: bigint;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  transactionId?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  paymentToken?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  transactionReceipt?: string;
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => ECOrder)
  orderId?: bigint;

  @BelongsTo(() => ECOrder, { as: 'order', foreignKey: 'orderId' })
  order?: ECOrder;

  @Column({
    type: DataType.BIGINT,
  })
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cardPan?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cardHash?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => ECPayment)
  parentPaymentId?: bigint;

  @BelongsTo(() => ECPayment, {
    as: 'parentPayment',
    foreignKey: 'parentPaymentId',
  })
  parentPayment?: ECPayment;
}
