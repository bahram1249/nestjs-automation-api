import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { EAVEntityType } from '../eav/eav-entity-type.entity';
import { ECPublishStatus } from './ec-publish-status.entity';
import { ECInventoryStatus } from './ec-inventory-status.entity';
import { ECBrand } from './ec-brand.entity';
import { User } from '../core/user.entity';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'ECProducts' })
export class ECProduct extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  title: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  slug: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  sku?: string;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => EAVEntityType)
  entityTypeId?: number;

  @BelongsTo(() => EAVEntityType, {
    foreignKey: 'entityTypeId',
    as: 'entityType',
  })
  entityType?: EAVEntityType;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECPublishStatus)
  publishStatusId?: number;

  @BelongsTo(() => ECPublishStatus, {
    foreignKey: 'publishStatusId',
    as: 'publishStatus',
  })
  publishStatus?: ECPublishStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECInventoryStatus)
  inventoryStatusId?: number;

  @BelongsTo(() => ECInventoryStatus, {
    foreignKey: 'inventoryStatusId',
    as: 'inventoryStatus',
  })
  inventoryStatus?: ECInventoryStatus;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECBrand)
  brandId?: number;

  @BelongsTo(() => ECBrand, { foreignKey: 'brandId', as: 'brand' })
  brand?: ECBrand;

  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  colorBased?: boolean;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  viewCount?: bigint;

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
}
