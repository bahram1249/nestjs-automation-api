import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Attachment } from '../core/attachment.entity';
import { Buffet } from './buffet.entity';

@Table({ tableName: 'DiscountCoffeBuffetGalleries' })
export class BuffetGallery extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  @ForeignKey(() => Buffet)
  buffetId: bigint;

  @BelongsTo(() => Buffet, {
    as: 'buffet',
    foreignKey: 'buffetId',
  })
  buffet?: Buffet;

  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  @ForeignKey(() => Attachment)
  attachmentId?: bigint;
  @BelongsTo(() => Attachment, {
    as: 'attachment',
    foreignKey: 'attachmentId',
  })
  attachment?: Attachment;
}
