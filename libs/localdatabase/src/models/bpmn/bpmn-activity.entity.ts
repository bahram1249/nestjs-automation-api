import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { BPMNActivityType } from "./bpmn-activity-type.entity";
import { BPMNPROCESS } from "./bpmn-process.entity";

@Table({ tableName: "BPMNActivities" })
export class BPMNActivity extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  name: string;
  @Column({
    type: DataType.BOOLEAN,
  })
  isStartActivity: boolean;
  @Column({
    type: DataType.BOOLEAN,
  })
  isEndActivity: boolean;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNActivityType)
  activityTypeId: number;

  @BelongsTo(() => BPMNActivityType, {
    as: "activityType",
    foreignKey: "activityTypeId",
  })
  activityType?: BPMNActivityType;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNPROCESS)
  processId: number;

  @BelongsTo(() => BPMNPROCESS, { as: "process", foreignKey: "processId" })
  process?: BPMNPROCESS;

  @Column({
    type: DataType.BOOLEAN,
  })
  haveMultipleItems: boolean;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => BPMNPROCESS)
  insideProcessRunnerId?: number;

  @BelongsTo(() => BPMNPROCESS, {
    as: "insideProcessRunner",
    foreignKey: "insideProcessRunnerId",
  })
  insideProcessRunner?: BPMNPROCESS;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
