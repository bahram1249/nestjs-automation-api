import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "BPMNNodeCommandTypes" })
export class BPMNNodeCommandType extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  name: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  commandColor?: string;
}
