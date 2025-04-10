import {
  Table,
  Model,
  DataType,
  Column,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSFactor } from './gs-factor.entity';
import { GSSolution } from './gs-solution.entity';
import { GSUnitPrice } from './gs-unit-price.entity';
import { GSWarrantyServiceType } from './gs-warranty-service-type.entity';
import { GSServiceType } from './gs-service-type.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'GSFactorServices' })
export class GSFactorService extends Model {
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

  @BelongsTo(() => GSFactor, {
    foreignKey: 'factorId',
    as: 'factor',
  })
  factor: GSFactor;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSSolution)
  solutionId?: number;

  @BelongsTo(() => GSSolution, {
    foreignKey: 'solutionId',
    as: 'solution',
  })
  solution?: GSSolution;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  partName?: string;
  @Column({
    type: DataType.INTEGER,
  })
  qty: number;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSUnitPrice)
  unitPriceId: number;

  @BelongsTo(() => GSUnitPrice, {
    foreignKey: 'unitPriceId',
    as: 'unitPrice',
  })
  unitPrice?: GSUnitPrice;

  @Column({
    type: DataType.BIGINT,
  })
  price: bigint;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSWarrantyServiceType)
  warrantyServiceTypeId: number;

  @BelongsTo(() => GSWarrantyServiceType, {
    foreignKey: 'warrantyServiceTypeId',
    as: 'warrantyServiceType',
  })
  warrantyServiceType?: GSWarrantyServiceType;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSServiceType)
  serviceTypeId: number;

  @BelongsTo(() => GSServiceType, {
    foreignKey: 'serviceTypeId',
    as: 'serviceType',
  })
  serviceType?: GSServiceType;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  createdByUserId: bigint;

  @BelongsTo(() => User, {
    foreignKey: 'createdByUserId',
    as: 'createdByUser',
  })
  createdByUser?: User;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  representativeShareOfSolution?: bigint;
}
