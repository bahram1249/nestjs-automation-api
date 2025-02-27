import { AutoMap } from "automapper-classes";
import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ tableName: "GSGuaranteePeriods" })
export class GSGuaranteePeriod extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  title: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  providerText?: string;
}
