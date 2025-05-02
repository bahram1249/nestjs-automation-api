import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { BPMNActivity } from './bpmn-activity.entity';
import { BPMNAction } from './bpmn-action.entity';
import { BPMNReferralType } from './bpmn-referral-type.entity';
import { Role, User } from '@rahino/database';
import { BPMNNodeCommand } from './bpmn-node-command.entity';

@Table({ tableName: 'BPMNNodes' })
export class BPMNNode extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNActivity)
  fromActivityId: number;

  @BelongsTo(() => BPMNActivity, {
    as: 'fromActivity',
    foreignKey: 'fromActivityId',
  })
  fromActivity?: BPMNActivity;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNActivity)
  toActivityId: number;

  @BelongsTo(() => BPMNActivity, {
    as: 'toActivity',
    foreignKey: 'toActivityId',
  })
  toActivity?: BPMNActivity;

  @Column({
    type: DataType.BOOLEAN,
  })
  autoIterate: boolean;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => BPMNAction)
  conditionFailedActionRunnerId?: number;

  @BelongsTo(() => BPMNAction, {
    as: 'conditionFailedActionRunner',
    foreignKey: 'conditionFailedActionRunnerId',
  })
  conditionFailedActionRunner?: BPMNAction;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNReferralType)
  referralTypeId: number;

  @BelongsTo(() => BPMNReferralType, {
    as: 'referralType',
    foreignKey: 'referralTypeId',
  })
  referralType?: BPMNReferralType;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => Role)
  roleId?: number;

  @BelongsTo(() => Role, { as: 'role', foreignKey: 'roleId' })
  role?: Role;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  userId?: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  injectForm?: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @HasMany(() => BPMNNodeCommand, {
    as: 'nodeCommands',
    foreignKey: 'nodeId',
    sourceKey: 'id',
  })
  nodeCommands: BPMNNodeCommand[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  eventCall?: boolean;
}
