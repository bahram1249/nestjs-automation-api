import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AttachmentType } from './attachmentType.entity';
import { User } from './user.entity';

@Table
export class Attachment extends Model {
  static associate(models) {
    // Attachment.belongsTo(models.AttachmentType, {
    //   foreignKey: 'attachmentTypeId',
    //   as: 'attachmentType',
    // });
    // Attachment.belongsTo(models.User, {
    //   foreignKey: 'userId',
    //   as: 'user',
    // });
  }

  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
    autoIncrement: true,
  })
  id: bigint;

  @Column({})
  originalFileName: string;
  @Column({})
  fileName: string;
  @Column({})
  ext: string;
  @Column({})
  mimetype: string;
  @Column({})
  path: string;
  @Column({})
  thumbnailPath: string;
  @Column({ onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @ForeignKey(() => AttachmentType)
  attachmentTypeId?: number;
  @BelongsTo(() => AttachmentType)
  attachmentType?: AttachmentType;
  @Column({ onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @ForeignKey(() => User)
  userId?: bigint;
  @BelongsTo(() => User)
  user?: User;
  @Column({})
  persianDate: string;
  @Column({})
  persianMonth: string;
  @Column({})
  isDeleted?: boolean;
  @Column({})
  deletedDate?: Date;
  @Column({})
  deletedBy?: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bucketName?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  etag?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  versionId?: string;
}
