import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Attachment } from '../core/attachment.entity';

@Table({ tableName: 'ECVendors' })
export class ECVendor extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  name: string;
  @Column({
    type: DataType.STRING,
  })
  slug: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDefault?: boolean;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => Attachment)
  attachmentId?: bigint;

  @BelongsTo(() => Attachment, { foreignKey: 'attachmentId', as: 'attachment' })
  attachment?: Attachment;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priorityOrder?: number;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
