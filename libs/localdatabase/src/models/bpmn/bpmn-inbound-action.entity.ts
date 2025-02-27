import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { BPMNActivity } from "./bpmn-activity.entity";
import { BPMNAction } from "./bpmn-action.entity";

@Table({ tableName: "BPMNInboundActions" })
export class BPMNInboundAction extends Model {
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
  activityId: number;

  @BelongsTo(() => BPMNActivity, { as: "activity", foreignKey: "activityId" })
  activity?: BPMNActivity;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNAction)
  actionId: number;

  @BelongsTo(() => BPMNAction, { as: "action", foreignKey: "actionId" })
  action?: BPMNAction;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priority?: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  isDeleted?: number;
}
