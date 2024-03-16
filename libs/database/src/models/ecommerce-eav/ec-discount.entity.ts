import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECDiscountType } from './ec-discount-type.entity';
import { ECDiscountActionType } from './ec-discount-action-type.entity';
import { ECDiscountActionRule } from './ec-discount-action-rule.entity';

@Table({ tableName: 'ECDiscounts' })
export class ECDiscount extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING,
  })
  name: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;
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

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECDiscountActionType)
  discountActionTypeId: number;

  @BelongsTo(() => ECDiscountActionType, {
    as: 'actionType',
    foreignKey: 'discountActionTypeId',
  })
  actionType?: ECDiscountActionType;

  @Column({
    type: DataType.DECIMAL,
  })
  discountValue: number;
  @Column({
    type: DataType.DECIMAL,
    allowNull: true,
  })
  maxValue?: number;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECDiscountActionRule)
  discountActionRuleId: number;

  @BelongsTo(() => ECDiscountActionRule, {
    as: 'actionRule',
    foreignKey: 'discountActionRuleId',
  })
  actionRule?: ECDiscountActionRule;

  @Column({
    type: DataType.BIGINT,
  })
  userId: bigint;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priority?: number;
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
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDate?: Date;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate?: Date;
}
