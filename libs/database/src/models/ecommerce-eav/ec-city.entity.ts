import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECProvince } from './ec-province.entity';

@Table({ tableName: 'ECCities' })
export class ECCity extends Model {
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
  @ForeignKey(() => ECProvince)
  provinceId: number;

  @BelongsTo(() => ECProvince, { foreignKey: 'provinceId', as: 'province' })
  province?: ECProvince;

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
