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
  @Column({})
  @ForeignKey(() => AttachmentType)
  attachmentTypeId: number;
  @BelongsTo(() => AttachmentType, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  attachmentType: AttachmentType;
  @Column({})
  @ForeignKey(() => User)
  userId: bigint;
  @BelongsTo(() => User, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  user: User;
  @Column({})
  persianDate: string;
  @Column({})
  persianMonth: string;
  @Column({})
  isDeleted: boolean;
}
