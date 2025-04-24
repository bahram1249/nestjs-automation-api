import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSFactor } from './gs-factor.entity';
import { GSUnitPrice } from './gs-unit-price.entity';
import { GSVipBundleType } from './gs-vip-bundle-types.entity';

@Table({ tableName: 'GSFactorVipBundles' })
export class GSFactorVipBundle extends Model<GSFactorVipBundle> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSFactor)
  factorId: bigint;

  @BelongsTo(() => GSFactor, { as: 'factor', foreignKey: 'factorId' })
  factor?: GSFactor;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSVipBundleType)
  vipBundleTypeId: number;

  @BelongsTo(() => GSVipBundleType, {
    as: 'vipBundleType',
    foreignKey: 'vipBundleTypeId',
  })
  vipBundleType?: GSVipBundleType;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  itemPrice: bigint;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => GSUnitPrice)
  unitPriceId: number;

  @BelongsTo(() => GSUnitPrice, { as: 'unitPrice', foreignKey: 'unitPriceId' })
  unitPrice?: GSUnitPrice;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  fee: bigint;
}
