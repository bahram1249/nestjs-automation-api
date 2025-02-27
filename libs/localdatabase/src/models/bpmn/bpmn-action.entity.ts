import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { BPMNActionType } from "./bpmn-action-type.entity";

@Table({ tableName: "BPMNActions" })
export class BPMNAction extends Model {
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
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BPMNActionType)
  actionTypeId: number;

  @BelongsTo(() => BPMNActionType, {
    as: "actionType",
    foreignKey: "actionTypeId",
  })
  actionType?: BPMNActionType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  actionSource?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  actionText?: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
