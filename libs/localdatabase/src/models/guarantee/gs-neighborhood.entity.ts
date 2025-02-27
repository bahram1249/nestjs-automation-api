import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { GSCity } from "./gs-city.entity";

@Table({ tableName: "GSNeighborhoods" })
export class GSNeighborhood extends Model {
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
    type: DataType.INTEGER,
    allowNull: true,
  })
  order?: number;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSCity)
  cityId: number;

  @BelongsTo(() => GSCity, { foreignKey: "cityId", as: "city" })
  city?: GSCity;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
