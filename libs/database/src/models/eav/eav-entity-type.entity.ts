import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { EAVEntityModel } from './eav-entity-model.entity';
import { AutoMap } from 'automapper-classes';
import { Attachment } from '../core/attachment.entity';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@Table({ tableName: 'EAVEntityTypes' })
export class EAVEntityType extends Model {
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
  name: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  slug: string;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => EAVEntityType)
  parentEntityTypeId?: number;

  @BelongsTo(() => EAVEntityType, {
    as: 'parentEntityType',
    foreignKey: 'parentEntityTypeId',
  })
  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => EAVEntityModel)
  entityModelId: number;
  @BelongsTo(() => EAVEntityModel, {
    as: 'entityModel',
    foreignKey: 'entityModelId',
  })
  entityModel?: EAVEntityModel;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => Attachment)
  attachmentId?: bigint;

  @BelongsTo(() => Attachment, { foreignKey: 'attachmentId', as: 'attachment' })
  attachment?: Attachment;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @HasMany(() => EAVEntityType, {
    foreignKey: 'parentEntityTypeId',
    sourceKey: 'id',
    as: 'subEntityTypes',
  })
  subEntityTypes?: EAVEntityType[];

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
  public description?: string;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  public priority?: number;
}
