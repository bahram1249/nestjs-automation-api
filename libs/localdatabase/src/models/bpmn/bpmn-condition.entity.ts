import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { BPMNConditionType } from "./bpmn-condition-type.entity";

@Table({ tableName: "BPMNConditions" })
export class BPMNCondition extends Model {
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
  @ForeignKey(() => BPMNConditionType)
  conditionTypeId: number;

  @BelongsTo(() => BPMNConditionType, {
    as: "conditionType",
    foreignKey: "conditionTypeId",
  })
  conditionType?: BPMNConditionType;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  conditionSource?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  conditionText?: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
