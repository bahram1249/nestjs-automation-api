import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BPMNOrganization } from './bpmn-organization.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'BPMNOrganizationUsers' })
export class BPMNOrganizationUser extends Model {
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
}
