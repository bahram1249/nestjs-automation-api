import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Attachment } from '../core/attachment.entity';
import { BuffetMenu } from './buffet-menu.entity';

@Table({ tableName: 'DiscountCoffeMenuCategories' })
export class BuffetMenuCategory extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  title?: string;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Attachment)
  coverAttachmentId: bigint;
  @BelongsTo(() => Attachment, { as: 'cover', foreignKey: 'coverAttachmentId' })
  cover?: Attachment;

  @HasMany(() => BuffetMenu, { foreignKey: 'menuCategoryId', as: 'menus' })
  menus?: BuffetMenu[];
}
