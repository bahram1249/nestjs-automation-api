import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { BPMNNode } from "./bpmn-node.entity";
import { BPMNNodeCommandType } from "./bpmn-node-command-type.entity";

@Table({ tableName: "BPMNNodeCommands" })
export class BPMNNodeCommand extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNNode)
  nodeId: number;

  @BelongsTo(() => BPMNNode, { as: "node", foreignKey: "nodeId" })
  node?: BPMNNode;

  @Column({
    type: DataType.STRING,
  })
  name: string;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNNodeCommandType)
  nodeCommandTypeId: number;

  @BelongsTo(() => BPMNNodeCommandType, {
    as: "nodeCommandType",
    foreignKey: "nodeCommandTypeId",
  })
  nodeCommandType?: BPMNNodeCommandType;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
