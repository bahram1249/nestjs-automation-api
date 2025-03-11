import { AutoMap } from 'automapper-classes';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSAssignedGuarantee } from './gs-assigned-guarantee.entity';
import { GSAdditionalPackage } from './gs-additional-package.entity';

@Table({ tableName: 'GSAssignedGuaranteeAdditionalPackages' })
export class GSAssignedGuaranteeAdditionalPackage extends Model {
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
  @ForeignKey(() => GSAssignedGuarantee)
  assignedGuaranteeId: bigint;

  @BelongsTo(() => GSAssignedGuarantee, {
    as: 'assignedGuarantee',
    foreignKey: 'assignedGuaranteeId',
  })
  assignedGuarantee?: GSAssignedGuarantee;

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
}
