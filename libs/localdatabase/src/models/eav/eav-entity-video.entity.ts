import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { EAVEntity } from './eav-entity.entity';
import { Attachment } from '@rahino/database';

@Table({ tableName: 'EAVEntityVideos' })
export class EAVEntityVideo extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: false,
    primaryKey: true,
  })
  @ForeignKey(() => EAVEntity)
  entityId: bigint;

  @BelongsTo(() => EAVEntity, { as: 'entity', foreignKey: 'entityId' })
  entity?: EAVEntity;

  @Column({
    type: DataType.BIGINT,
    autoIncrement: false,
    primaryKey: true,
  })
  @ForeignKey(() => Attachment)
  attachmentId: bigint;

  @BelongsTo(() => Attachment, {
    as: 'attachment',
    foreignKey: 'attachmentId',
  })
  attachment?: Attachment;
}
