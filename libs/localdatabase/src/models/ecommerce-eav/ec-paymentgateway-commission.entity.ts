import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECPaymentGatewayCommissionType } from './ec-paymentgateway-commissiontype.entity';
import { ECVendorCommissionType } from './ec-vendor-commission-type.entity';
import { ECPaymentGateway } from './ec-payment-gateway.entity';

@Table({ tableName: 'ECPaymentGatewayCommissions' })
export class ECPaymentGatewayCommission extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

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
  @ForeignKey(() => ECPaymentGatewayCommissionType)
  commissionTypeId: number;

  @BelongsTo(() => ECPaymentGatewayCommissionType, {
    as: 'commissionType',
    foreignKey: 'commissionTypeId',
  })
  commissionType?: ECVendorCommissionType;

  @Column({
    type: DataType.BIGINT,
  })
  amount: bigint;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
