import { AutoMap } from 'automapper-classes';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSPaymentWay } from './gs-payment-way.entity';

@Table({ tableName: 'GSPaymentGateways' })
export class GSPaymentGateway extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  title: string;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSPaymentWay)
  paymentWayId: number;

  @BelongsTo(() => GSPaymentWay, {
    as: 'paymentWay',
    foreignKey: 'paymentWayId',
  })
  paymentWay?: GSPaymentWay;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  serviceProvider?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  username?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  clientToken?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  secretToken?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  icon?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  merchantId?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  terminalId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  merchantKey?: string;
}
