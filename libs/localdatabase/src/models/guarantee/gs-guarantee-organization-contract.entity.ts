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

@Table({ tableName: 'GSGuaranteeOrganizationContracts' })
export class GSGuaranteeOrganizationContract extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
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
  organization?: GSGuaranteeOrganization;

  @Column({
    type: DataType.DATE,
  })
  startDate: Date;
  @Column({
    type: DataType.DATE,
  })
  endDate: Date;
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  representativeShare: number;
}
