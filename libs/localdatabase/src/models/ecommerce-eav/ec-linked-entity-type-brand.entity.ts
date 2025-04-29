import { AutoMap } from 'automapper-classes';

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { EAVEntityType } from '../eav';
import { ECBrand } from './ec-brand.entity';

@Table({ tableName: 'ECLinkedEntityTypeBrands' })
export class ECLinkedEntityTypeBrand extends Model {
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
  })
  @ForeignKey(() => EAVEntityType)
  entityTypeId: number;

  @BelongsTo(() => EAVEntityType, {
    as: 'entityType',
    foreignKey: 'entityTypeId',
  })
  entityType?: EAVEntityType;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECBrand)
  brandId: number;

  @BelongsTo(() => ECBrand, {
    as: 'brand',
    foreignKey: 'brandId',
  })
  brand?: ECBrand;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @AutoMap()
  metaTitle?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @AutoMap()
  metaKeywords?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @AutoMap()
  metaDescription?: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
