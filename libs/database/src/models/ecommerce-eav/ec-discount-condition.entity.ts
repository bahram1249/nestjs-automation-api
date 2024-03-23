import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECDiscount } from './ec-discount.entity';
import { ECDiscountConditionType } from './ec-discount-condition-type.entity';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'ECDiscountConditions' })
export class ECDiscountCondition extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECDiscount)
  discountId: bigint;

  @BelongsTo(() => ECDiscount, { as: 'discount', foreignKey: 'discountId' })
  discount?: ECDiscount;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECDiscountConditionType)
  conditionTypeId: number;

  @BelongsTo(() => ECDiscountConditionType, {
    as: 'conditionType',
    foreignKey: 'conditionTypeId',
  })
  conditionType?: ECDiscountConditionType;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  conditionValue: bigint;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDefault?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @Column({
    type: DataType.VIRTUAL,
    allowNull: true,
  })
  name?: string;
}
