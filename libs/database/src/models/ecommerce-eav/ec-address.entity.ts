import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../core/user.entity';
import { ECProvince } from './ec-province.entity';
import { ECCity } from './ec-city.entity';
import { ECNeighborhood } from './ec-neighborhood.entity';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'ECAddresses' })
export class ECAddress extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name?: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  latitude?: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  longitude?: string;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECProvince)
  provinceId: number;

  @BelongsTo(() => ECProvince, { foreignKey: 'provinceId', as: 'province' })
  province?: ECProvince;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECCity)
  cityId: number;

  @BelongsTo(() => ECCity, { foreignKey: 'cityId', as: 'city' })
  city?: ECCity;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECNeighborhood)
  neighborhoodId?: number;

  @BelongsTo(() => ECNeighborhood, {
    foreignKey: 'neighborhoodId',
    as: 'neighborhood',
  })
  neighborhood?: ECNeighborhood;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  street?: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  alley?: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  plaque?: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  floorNumber?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  userId?: bigint;

  @BelongsTo(() => User, { foreignKey: 'userId', as: 'user' })
  user?: User;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  postalCode?: string;
}
