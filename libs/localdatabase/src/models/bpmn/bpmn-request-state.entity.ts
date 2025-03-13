import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { BPMNRequest } from './bpmn-request.entity';
import { BPMNActivity } from './bpmn-activity.entity';
import { Role, User } from '@rahino/database';
import { BPMNOrganization } from './bpmn-organization.entity';
import { BPMNNode } from './bpmn-node.entity';
import { GSRequest } from '../guarantee';

@Table({ tableName: 'BPMNRequestStates' })
export class BPMNRequestState extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  @ForeignKey(() => BPMNRequest)
  requestId: bigint;

  @BelongsTo(() => BPMNRequest, { as: 'request', foreignKey: 'requestId' })
  request?: BPMNRequest;

  @BelongsTo(() => GSRequest, {
    as: 'guaranteeRequest',
    foreignKey: 'requestId',
  })
  guaranteeRequest?: GSRequest;

  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNActivity)
  activityId: number;

  @BelongsTo(() => BPMNActivity, { as: 'activity', foreignKey: 'activityId' })
  activity?: BPMNActivity;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  userId?: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => Role)
  roleId?: number;

  @BelongsTo(() => Role, { as: 'role', foreignKey: 'roleId' })
  role?: Role;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => BPMNOrganization)
  organizationId?: number;

  @BelongsTo(() => BPMNOrganization, {
    as: 'organization',
    foreignKey: 'organizationId',
  })
  organization?: BPMNOrganization;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  returnRequestStateId?: bigint;

  @HasMany(() => BPMNNode, {
    as: 'nodes',
    foreignKey: 'fromActivityId',
    sourceKey: 'activityId',
  })
  nodes?: BPMNNode[];
}
