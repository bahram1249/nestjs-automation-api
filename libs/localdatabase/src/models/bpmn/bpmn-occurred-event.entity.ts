import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "BPMNOccurredEvents" })
export class BPMNOccurredEvent extends Model {
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
  isDeleted?: boolean;
}
