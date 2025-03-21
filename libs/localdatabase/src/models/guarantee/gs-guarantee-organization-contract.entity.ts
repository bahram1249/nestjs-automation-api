import { AutoMap } from 'automapper-classes';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSGuaranteeOrganization } from './gs-guarantee-organization.entity';
import { BPMNOrganization } from '../bpmn';

@Table({ tableName: 'GSGuaranteeOrganizationContracts' })
export class GSGuaranteeOrganizationContract extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  @ForeignKey(() => GSGuaranteeOrganization)
  organizationId: number;

  @BelongsTo(() => GSGuaranteeOrganization, {
    as: 'guaranteeOrganization',
    foreignKey: 'organizationId',
  })
  guaranteeOrganization?: GSGuaranteeOrganization;

  @BelongsTo(() => BPMNOrganization, {
    as: 'bpmnOrganization',
    foreignKey: 'organizationId',
  })
  bpmnOrganization?: BPMNOrganization;

  @AutoMap()
  @Column({
    type: DataType.DATE,
  })
  startDate: Date;

  @AutoMap()
  @Column({
    type: DataType.DATE,
  })
  endDate: Date;

  @AutoMap()
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  representativeShare: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
