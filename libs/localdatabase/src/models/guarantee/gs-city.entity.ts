import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { GSProvince } from "./gs-province.entity";

@Table({ tableName: "GSCities" })
export class GSCity extends Model {
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
  slug?: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  neighborhoodBase?: boolean;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSProvince)
  provinceId: number;

  @BelongsTo(() => GSProvince, { foreignKey: "provinceId", as: "province" })
  province?: GSProvince;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  order?: number;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
