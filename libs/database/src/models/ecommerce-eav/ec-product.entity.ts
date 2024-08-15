import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { EAVEntityType } from '../eav/eav-entity-type.entity';
import { ECPublishStatus } from './ec-publish-status.entity';
import { ECInventoryStatus } from './ec-inventory-status.entity';
import { ECBrand } from './ec-brand.entity';
import { User } from '../core/user.entity';
import { AutoMap } from 'automapper-classes';
import { EAVEntityAttributeValue } from '../eav/eav-entity-attribute-value.entity';
import { ECInventory } from './ec-inventory.entity';
import { Attachment } from '../core/attachment.entity';
import { EAVEntityPhoto } from '../eav/eav-entity-photo.entity';
import { EAVEntityVideo } from '../eav/eav-entity-video.entity';

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

  @HasMany(() => ECInventory, {
    as: 'inventories',
    foreignKey: 'productId',
  })
  inventories?: ECInventory[];

  @HasMany(() => EAVEntityPhoto, {
    as: 'productPhotos',
    foreignKey: 'entityId',
    sourceKey: 'id',
  })
  productPhotos?: EAVEntityPhoto[];

  @BelongsToMany(
    () => Attachment,
    () => EAVEntityPhoto,
    'entityId',
    'attachmentId',
  )
  attachments?: Attachment[];

  @BelongsToMany(
    () => Attachment,
    () => EAVEntityVideo,
    'entityId',
    'attachmentId',
  )
  videos?: Attachment[];

  @BelongsToMany(
    () => Attachment,
    () => EAVEntityVideo,
    'entityId',
    'attachmentId',
  )
  videoAttachments?: Attachment[];

  @HasMany(() => EAVEntityAttributeValue, {
    foreignKey: 'entityId',
    sourceKey: 'id',
    as: 'productAttributeValues',
  })
  productAttributeValues?: EAVEntityAttributeValue[];

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  lastPrice?: bigint;

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
    type: DataType.FLOAT,
    allowNull: true,
  })
  weight?: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  score?: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  cntComment?: number;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  productFormulaId?: number;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  wages?: number;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  stoneMoney?: bigint;
}
