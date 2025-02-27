import { AutoMap } from "automapper-classes";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { GSProvider } from "./gs-provider.entity";

@Table({ tableName: "GSVariants" })
export class GSVariant extends Model {
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
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSProvider)
  providerId?: number;

  @BelongsTo(() => GSProvider, { as: "provider", foreignKey: "providerId" })
  provider?: GSProvider;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  providerBaseId?: number;
}
