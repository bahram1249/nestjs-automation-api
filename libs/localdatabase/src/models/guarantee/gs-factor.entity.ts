import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { GSUnitPrice } from './gs-unit-price.entity';
import { GSFactorStatus } from './gs-factor-status.entity';
import { GSFactorType } from './gs-factor-type.entity';
import { User } from '@rahino/database';
import { GSRequest } from './gs-request.entity';
import { BPMNRequest } from '../bpmn';
import { GSGuarantee } from './gs-guarantee.entity';
import { GSFactorAdditionalPackage } from './gs-factor-additional-package.entity';
import { GSAdditionalPackage } from './gs-additional-package.entity';

@Table({ tableName: 'GSFactors' })
export class GSFactor extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSUnitPrice)
  unitPriceId: number;

  @BelongsTo(() => GSUnitPrice, { as: 'unitPrice', foreignKey: 'unitPriceId' })
  unitPrice?: GSUnitPrice;

  @Column({
    type: DataType.BIGINT,
  })
  totalPrice: bigint;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSFactorStatus)
  factorStatusId: number;

  @BelongsTo(() => GSFactorStatus, {
    as: 'factorStatus',
    foreignKey: 'factorStatusId',
  })
  factorStatus?: GSFactorStatus;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSFactorType)
  factorTypeId: number;

  @BelongsTo(() => GSFactorType, {
    as: 'factorType',
    foreignKey: 'factorTypeId',
  })
  factorType?: GSFactorType;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.DATE,
  })
  expireDate: Date;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => GSRequest)
  requestId: bigint;

  @BelongsTo(() => GSRequest, {
    as: 'guaranteeRequest',
    foreignKey: 'requestId',
  })
  guaranteeRequest?: GSRequest;

  @BelongsTo(() => BPMNRequest, { as: 'bpmnRequest', foreignKey: 'requestId' })
  bpmnRequest?: BPMNRequest;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => GSGuarantee)
  guaranteeId?: bigint;

  @BelongsTo(() => GSGuarantee, { as: 'guarantee', foreignKey: 'guaranteeId' })
  guarantee?: GSGuarantee;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  representativeShareOfSolution?: bigint;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  createdByUserId?: bigint;

  @BelongsTo(() => User, { as: 'createdByUser', foreignKey: 'createdByUserId' })
  createdByUser: User;

  @BelongsToMany(
    () => GSAdditionalPackage,
    () => GSFactorAdditionalPackage,
    'factorId',
    'additionalPackageId',
  )
  additionalPackages?: GSAdditionalPackage[];

  @HasMany(() => GSFactorAdditionalPackage, {
    as: 'factorAdditionalPackages',
    foreignKey: 'factorId',
  })
  factorAdditionalPackages?: GSFactorAdditionalPackage[];
}
