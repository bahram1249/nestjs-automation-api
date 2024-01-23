import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECCity } from './ec-city.entity';

@Table({ tableName: 'ECNeighborhoods' })
export class ECNeighborhood extends Model {
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
  @ForeignKey(() => ECCity)
  cityId: number;

  @BelongsTo(() => ECCity, { foreignKey: 'cityId', as: 'city' })
  city?: ECCity;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
