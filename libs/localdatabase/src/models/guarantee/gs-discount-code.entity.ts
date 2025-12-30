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
import { GSDiscountType } from './gs-discount-type.entity';

@Table({ tableName: 'GSDiscountCodes' })
export class GSDiscountCode extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  code: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => GSDiscountType)
  discountTypeId: number;

  @BelongsTo(() => GSDiscountType, {
    as: 'discountType',
    foreignKey: 'discountTypeId',
  })
  discountType: GSDiscountType;

  @AutoMap()
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  discountValue: number;

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
    type: DataType.INTEGER,
    allowNull: false,
  })
  totalUsageLimit: number;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  perUserUsageLimit: number;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  maxDiscountAmount: bigint;

  @AutoMap()
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  validFrom: Date;

  @AutoMap()
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  validUntil: Date;

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
}
