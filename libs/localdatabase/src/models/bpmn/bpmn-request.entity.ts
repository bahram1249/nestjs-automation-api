import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '@rahino/database';
import { BPMNPROCESS } from './bpmn-process.entity';
import { BPMNOrganization } from './bpmn-organization.entity';

@Table({ tableName: 'BPMNRequests' })
export class BPMNRequest extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNPROCESS)
  processId: number;

  @BelongsTo(() => BPMNPROCESS, { as: 'process', foreignKey: 'processId' })
  process?: BPMNPROCESS;

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
}
