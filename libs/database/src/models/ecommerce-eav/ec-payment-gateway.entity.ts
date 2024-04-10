import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECVariationPrice } from './ec-variation-prices';

@Table({ tableName: 'ECPaymentGateways' })
export class ECPaymentGateway extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECVariationPrice)
  variationPriceId: number;

  @BelongsTo(() => ECVariationPrice, {
    as: 'variationPrice',
    foreignKey: 'variationPriceId',
  })
  variationPrice?: ECVariationPrice;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  serviceName?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}