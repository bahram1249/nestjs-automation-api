import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '@rahino/database';
import { GSProvince } from './gs-province.entity';
import { GSCity } from './gs-city.entity';
import { GSNeighborhood } from './gs-neighborhood.entity';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'GSAddresses' })
export class GSAddress extends Model {
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
  @ForeignKey(() => GSProvince)
  provinceId: number;

  @BelongsTo(() => GSProvince, { foreignKey: 'provinceId', as: 'province' })
  province?: GSProvince;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSCity)
  cityId?: number;

  @BelongsTo(() => GSCity, { foreignKey: 'cityId', as: 'city' })
  city?: GSCity;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSNeighborhood)
  neighborhoodId?: number;

  @BelongsTo(() => GSNeighborhood, {
    foreignKey: 'neighborhoodId',
    as: 'neighborhood',
  })
  neighborhood?: GSNeighborhood;

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
