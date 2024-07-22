import { AutoMap } from 'automapper-classes';

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Attachment } from '../core/attachment.entity';

@Table({ tableName: 'ECBrands' })
export class ECBrand extends Model {
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

  @Column({
    type: DataType.STRING,
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
  description?: string;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priority?: number;
}
