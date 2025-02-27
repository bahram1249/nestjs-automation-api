import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { EAVEntityType } from './eav-entity-type.entity';
import { EAVBlogPublish } from './eav-blog-publish.entity';
import { Attachment, User } from '@rahino/database';
import { AutoMap } from 'automapper-classes';
import { EAVEntityPhoto } from './eav-entity-photo.entity';

@Table({ tableName: 'EAVPosts' })
export class EAVPost extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  id: bigint;
  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => EAVEntityType)
  entityTypeId?: number;

  @BelongsTo(() => EAVEntityType)
  entityType?: EAVEntityType;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => EAVBlogPublish)
  publishId: number;

  @BelongsTo(() => EAVBlogPublish)
  publish?: EAVBlogPublish;
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
  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  description: string;
  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  metaTitle?: string;
  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  metaDescription?: string;
  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  metaKeywords?: string;
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  userId?: bigint;

  @BelongsTo(() => User)
  user?: User;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @BelongsToMany(
    () => Attachment,
    () => EAVEntityPhoto,
    'entityId',
    'attachmentId',
  )
  attachments?: Attachment[];
}
