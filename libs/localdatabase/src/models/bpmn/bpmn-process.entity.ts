import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "BPMNProcess" })
export class BPMNPROCESS extends Model {
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
    allowNull: true,
  })
  isSubProcess?: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  staticId?: number;
}
