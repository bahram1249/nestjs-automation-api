import { AutoMap } from 'automapper-classes';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSUnitPrice } from './gs-unit-price.entity';
import { GSVipBundleType } from './gs-vip-bundle-types.entity';

@Table({ tableName: 'GSRewardRules' })
export class GSRewardRule extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  rewardAmount: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  @ForeignKey(() => GSUnitPrice)
  unitPriceId: number;

  @BelongsTo(() => GSUnitPrice, { as: 'unitPrice', foreignKey: 'unitPriceId' })
  unitPrice?: GSUnitPrice;

  @AutoMap()
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  validFrom?: Date;

  @AutoMap()
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  validUntil?: Date;

  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @AutoMap()
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: false,
  })
  @AutoMap()
  isDeleted?: boolean;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  monthPeriod?: number;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => GSVipBundleType)
  vipBundleTypeId?: number;

  @BelongsTo(() => GSVipBundleType, {
    as: 'vipBundleType',
    foreignKey: 'vipBundleTypeId',
  })
  vipBundleType?: GSVipBundleType;
}
