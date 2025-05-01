import { AutoMap } from 'automapper-classes';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSRequest } from './gs-request.entity';
import { Attachment, User } from '@rahino/database';
import { GSRequestAttachmentType } from './gs-request-attachment-type.entity';

@Table({ tableName: 'GSRequestAttachments' })
export class GSRequestAttachment extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSRequest)
  requestId: bigint;

  @BelongsTo(() => GSRequest, { as: 'request', foreignKey: 'requestId' })
  request?: GSRequest;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Attachment)
  attachmentId: bigint;

  @BelongsTo(() => Attachment, { as: 'attachment', foreignKey: 'attachmentId' })
  attachment?: Attachment;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => GSRequestAttachmentType)
  requestAttachmentTypeId: number;

  @BelongsTo(() => GSRequestAttachmentType, {
    as: 'requestAttachmentType',
    foreignKey: 'requestAttachmentTypeId',
  })
  requestAttachmentType?: GSRequestAttachmentType;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
