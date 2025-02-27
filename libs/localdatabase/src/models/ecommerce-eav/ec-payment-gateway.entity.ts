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
  clientId?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  secret?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  eligibleRequest?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  eligibleChargeWallet?: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl?: string;

  @Column({
    type: DataType.VIRTUAL,
    allowNull: true,
  })
  eligibleCheck?: boolean;

  @Column({
    type: DataType.VIRTUAL,
    allowNull: true,
  })
  titleMessage?: string;

  @Column({
    type: DataType.VIRTUAL,
    allowNull: true,
  })
  description?: string;
}
