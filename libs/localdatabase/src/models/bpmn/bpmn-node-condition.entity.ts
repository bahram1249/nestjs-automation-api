import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { BPMNNode } from "./bpmn-node.entity";
import { BPMNCondition } from "./bpmn-condition.entity";

@Table({ tableName: "BPMNNodeConditions" })
export class BPMNNodeCondition extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  @ForeignKey(() => BPMNNode)
  nodeId: number;

  @BelongsTo(() => BPMNNode, { as: "node", foreignKey: "nodeId" })
  node?: BPMNNode;

  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  @ForeignKey(() => BPMNCondition)
  conditionId: number;

  @BelongsTo(() => BPMNCondition, {
    as: "condition",
    foreignKey: "conditionId",
  })
  condition?: BPMNCondition;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priority?: number;
}
