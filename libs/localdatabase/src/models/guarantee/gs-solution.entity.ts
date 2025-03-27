import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { GSUnitPrice } from './gs-unit-price.entity';
import { GSProvince } from './gs-province.entity';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'GSSolutions' })
export class GSSolution extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  title?: string;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  fee: bigint;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSUnitPrice)
  unitPriceId: number;

  @BelongsTo(() => GSUnitPrice)
  unitPrice?: GSUnitPrice;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSProvince)
  provinceId?: number;

  @BelongsTo(() => GSProvince, { as: 'province', foreignKey: 'provinceId' })
  province?: GSProvince;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSSolution)
  parentId?: number;

  @BelongsTo(() => GSSolution, { as: 'parentSolution', foreignKey: 'parentId' })
  parent?: GSSolution;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @HasMany(() => GSSolution, { foreignKey: 'parentId', sourceKey: 'id' })
  provinceSolutions?: GSSolution[];
}
