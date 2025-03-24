import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '@rahino/database';
import { GSGuaranteeOrganization } from './gs-guarantee-organization.entity';

@Table({ tableName: 'GSTechnicalPersons' })
export class GSTechnicalPerson extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  @ForeignKey(() => GSGuaranteeOrganization)
  organizationId: bigint;

  @BelongsTo(() => GSGuaranteeOrganization, {
    as: 'organization',
    foreignKey: 'organizationId',
  })
  organization?: GSGuaranteeOrganization;
}
