import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BPMNRequest } from './bpmn-request.entity';
import { BPMNNode } from './bpmn-node.entity';
import { BPMNNodeCommand } from './bpmn-node-command.entity';
import { BPMNActivity } from './bpmn-activity.entity';
import { Role, User } from '@rahino/database';
import { BPMNOrganization } from './bpmn-organization.entity';

@Table({ tableName: 'BPMNRequestHistories' })
export class BPMNRequestHistory extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  @ForeignKey(() => BPMNRequest)
  requestId: bigint;

  @BelongsTo(() => BPMNRequest, { as: 'request', foreignKey: 'requestId' })
  request: BPMNRequest;

  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNNode)
  nodeId: number;

  @BelongsTo(() => BPMNNode, { as: 'node', foreignKey: 'nodeId' })
  node: BPMNNode;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNNodeCommand)
  nodeCommandId: number;

  @BelongsTo(() => BPMNNodeCommand, {
    as: 'nodeCommand',
    foreignKey: 'nodeCommandId',
  })
  nodeCommand: BPMNNodeCommand;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNActivity)
  fromActivityId: number;

  @BelongsTo(() => BPMNActivity, {
    as: 'fromActivity',
    foreignKey: 'fromActivityId',
  })
  fromActivity: BPMNActivity;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNActivity)
  toActivityId: number;

  @BelongsTo(() => BPMNActivity, {
    as: 'toActivity',
    foreignKey: 'toActivityId',
  })
  toActivity: BPMNActivity;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  fromUserId?: bigint;

  @BelongsTo(() => User, { as: 'fromUser', foreignKey: 'fromUserId' })
  fromUser?: User;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => BPMNOrganization)
  fromOrganizationId?: number;

  @BelongsTo(() => BPMNOrganization, {
    as: 'fromOrganization',
    foreignKey: 'fromOrganizationId',
  })
  fromOrganization?: BPMNOrganization;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => Role)
  fromRoleId?: number;

  @BelongsTo(() => Role, { as: 'fromRole', foreignKey: 'fromRoleId' })
  fromRole?: Role;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  toUserId?: bigint;

  @BelongsTo(() => User, { as: 'toUser', foreignKey: 'toUserId' })
  toUser?: User;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => Role)
  toRoleId?: number;

  @BelongsTo(() => Role, { as: 'toRole', foreignKey: 'toRoleId' })
  toRole?: Role;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => BPMNOrganization)
  toOrganizationId?: number;

  @BelongsTo(() => BPMNOrganization, {
    as: 'toOrganization',
    foreignKey: 'toOrganizationId',
  })
  toOrganization?: BPMNOrganization;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  executeBundle?: string;
}
