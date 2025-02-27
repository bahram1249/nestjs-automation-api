import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ECDiscountType } from './ec-discount-type.entity';
import { ECDiscountActionType } from './ec-discount-action-type.entity';
import { ECDiscountActionRule } from './ec-discount-action-rule.entity';
import { AutoMap } from 'automapper-classes';
import { ECDiscountCondition } from './ec-discount-condition.entity';

@Table({ tableName: 'ECDiscounts' })
export class ECDiscount extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECDiscountType)
  discountTypeId: number;

  @BelongsTo(() => ECDiscountType, {
    as: 'discountType',
    foreignKey: 'discountTypeId',
  })
  discountType?: ECDiscountType;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECDiscountActionType)
  discountActionTypeId?: number;

  @BelongsTo(() => ECDiscountActionType, {
    as: 'actionType',
    foreignKey: 'discountActionTypeId',
  })
  actionType?: ECDiscountActionType;

  @AutoMap()
  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  discountValue?: number;

  @AutoMap()
  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  maxValue?: number;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECDiscountActionRule)
  discountActionRuleId?: number;

  @BelongsTo(() => ECDiscountActionRule, {
    as: 'actionRule',
    foreignKey: 'discountActionRuleId',
  })
  actionRule?: ECDiscountActionRule;

  @Column({
    type: DataType.BIGINT,
  })
  userId: bigint;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priority?: number;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  couponCode: string;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  limit?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  used?: number;

  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isActive?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @AutoMap()
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDate?: Date;

  @AutoMap()
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate?: Date;

  @HasMany(() => ECDiscountCondition, {
    foreignKey: 'discountId',
    as: 'conditions',
  })
  conditions?: ECDiscountCondition[];

  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  freeShipment?: boolean;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  minPrice?: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  maxPrice?: bigint;
}
