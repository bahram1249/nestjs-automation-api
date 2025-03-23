import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BPMNOrganization } from './bpmn-organization.entity';
import { Role, User } from '@rahino/database';

@Table({ tableName: 'BPMNOrganizationUsers' })
export class BPMNOrganizationUser extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: bigint;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  @ForeignKey(() => BPMNOrganization)
  organizationId: number;

  @BelongsTo(() => BPMNOrganization, {
    as: 'organization',
    foreignKey: 'organizationId',
  })
  organization?: BPMNOrganization;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  @ForeignKey(() => User)
  userId: number;

  @BelongsTo(() => User, {
    as: 'user',
    foreignKey: 'userId',
  })
  user?: User;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => Role)
  roleId: number;

  @BelongsTo(() => Role, { as: 'role', foreignKey: 'roleId' })
  role?: Role;
}
