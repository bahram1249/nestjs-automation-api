import { AutoMap } from "automapper-classes";
import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "GSGuaranteeTypes" })
export class GSGuaranteeType extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  title: string;
}
