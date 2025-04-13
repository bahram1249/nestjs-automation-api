import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSFactor } from './gs-factor.entity';
import { GSAdditionalPackage } from './gs-additional-package.entity';
import { GSUnitPrice } from './gs-unit-price.entity';

@Table({ tableName: 'GSFactorAdditionalPackages' })
export class GSFactorAdditionalPackage extends Model {
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
  @ForeignKey(() => GSAdditionalPackage)
  additionalPackageId: number;

  @BelongsTo(() => GSAdditionalPackage, {
    as: 'additionalPackage',
    foreignKey: 'additionalPackageId',
  })
  additionalPackage?: GSAdditionalPackage;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  itemPrice?: bigint;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSUnitPrice)
  unitPriceId?: bigint;

  @BelongsTo(() => GSUnitPrice, { as: 'unitPrice', foreignKey: 'unitPriceId' })
  unitPrice?: GSUnitPrice;
}
