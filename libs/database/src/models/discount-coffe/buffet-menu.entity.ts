import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BuffetMenuCategory } from './buffet-menu-category.entity';
import { Buffet } from './buffet.entity';
import { User } from '../core/user.entity';
import { Attachment } from '../core/attachment.entity';

@Table({ tableName: 'DiscountCoffeMenus' })
export class BuffetMenu extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Attachment)
  attachmentId?: bigint;
  @BelongsTo(() => Attachment, { as: 'cover', foreignKey: 'attachmentId' })
  cover?: Attachment;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BuffetMenuCategory)
  menuCategoryId: number;
  @BelongsTo(() => BuffetMenuCategory, {
    as: 'menuCategory',
    foreignKey: 'menuCategoryId',
  })
  menuCategory?: BuffetMenuCategory;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Buffet)
  buffetId: bigint;
  @BelongsTo(() => Buffet, { as: 'buffet', foreignKey: 'buffetId' })
  buffet?: Buffet;

  @Column({
    type: DataType.BIGINT,
  })
  price: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;
  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.BOOLEAN,
  })
  isDeleted?: boolean;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  deletedBy?: bigint;
  @BelongsTo(() => User, { foreignKey: 'deletedBy', as: 'deletedByUser' })
  deletedByUser?: User;

  @Column({
    type: DataType.DATE,
  })
  deletedAt?: Date;
}
