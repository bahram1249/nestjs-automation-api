import { AutoMap } from 'automapper-classes';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSDiscountCode } from './gs-discount-code.entity';
import { GSFactor } from './gs-factor.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'GSDiscountCodeUsages' })
export class GSDiscountCodeUsage extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  discountCodeId: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  factorId: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  discountAmount: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  maxDiscountAmount?: bigint;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  usedAt: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @AutoMap()
  isDeleted?: boolean;

  @BelongsTo(() => GSDiscountCode, {
    as: 'discountCode',
    foreignKey: 'discountCodeId',
  })
  discountCode?: GSDiscountCode;

  @BelongsTo(() => GSFactor, {
    as: 'factor',
    foreignKey: 'factorId',
  })
  factor?: GSFactor;

  @BelongsTo(() => User, {
    as: 'user',
    foreignKey: 'userId',
  })
  user?: User;
}
