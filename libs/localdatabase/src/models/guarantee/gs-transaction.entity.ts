import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSTransactionStatus } from './gs-transaction-status.entity';
import { GSUnitPrice } from './gs-unit-price.entity';
import { GSFactor } from './gs-factor.entity';
import { User } from '@rahino/database';
import { GSPaymentGateway } from './gs-payment-gateway.entity';

@Table({ tableName: 'GSTransactions' })
export class GSTransaction extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @ForeignKey(() => GSTransactionStatus)
  @Column({
    type: DataType.INTEGER,
  })
  transactionStatusId: number;

  @BelongsTo(() => GSTransactionStatus, {
    as: 'transactionStatus',
    foreignKey: 'transactionStatusId',
  })
  transactionStatus?: GSTransactionStatus;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSUnitPrice)
  unitPriceId: number;

  @BelongsTo(() => GSUnitPrice, { as: 'unitPrice', foreignKey: 'unitPriceId' })
  unitPrice?: GSUnitPrice;

  @Column({
    type: DataType.BIGINT,
  })
  totalPrice: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSFactor)
  factorId: bigint;

  @BelongsTo(() => GSFactor, { as: 'factor', foreignKey: 'factorId' })
  factor?: GSFactor;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => GSPaymentGateway)
  paymentGatewayId: number;

  @BelongsTo(() => GSPaymentGateway, {
    as: 'paymentGateway',
    foreignKey: 'paymentGatewayId',
  })
  paymentGateway?: GSPaymentGateway;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  token?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  signData?: string;
}
