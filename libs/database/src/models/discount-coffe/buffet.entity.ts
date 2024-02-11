import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { User } from '../core/user.entity';
import { Attachment } from '../core/attachment.entity';
import { BuffetType } from './buffet-type.entity';
import { BuffetCost } from './buffet-cost.entity';
import { BuffetCity } from './city.entity';
import { CoffeOption } from './coffe-option.entity';
import { BuffetOption } from './buffet-option.entity';
import { BuffetGallery } from './buffet-gallery.entity';

@Table({ tableName: 'DiscountCoffeBuffets' })
export class Buffet extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Attachment)
  coverAttachmentId?: bigint;
  @BelongsTo(() => Attachment, {
    as: 'coverAttachment',
    foreignKey: 'coverAttachmentId',
  })
  coverAttachment?: Attachment;

  @Column({
    type: DataType.STRING,
  })
  title: string;
  @Column({
    type: DataType.STRING,
  })
  urlAddress?: string;
  @Column({
    type: DataType.INTEGER,
  })
  percentDiscount?: number;
  @Column({
    type: DataType.STRING,
  })
  buffetDescription?: string;
  @Column({
    type: DataType.STRING,
  })
  buffetAddress?: string;
  @Column({
    type: DataType.STRING,
  })
  buffetPhone?: string;
  @Column({
    type: DataType.STRING,
  })
  wazeLink?: string;
  @Column({
    type: DataType.STRING,
  })
  baladLink?: string;
  @Column({
    type: DataType.STRING,
  })
  neshanLink?: string;
  @Column({
    type: DataType.STRING,
  })
  googleMapLink?: string;
  @Column({
    type: DataType.STRING,
  })
  latitude?: string;
  @Column({
    type: DataType.STRING,
  })
  longitude?: string;
  @Column({
    type: DataType.BIGINT,
  })
  viewCount?: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;
  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;
  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
  })
  ownerId: bigint;
  @BelongsTo(() => User, { as: 'owner', foreignKey: 'ownerId' })
  owner?: User;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BuffetType)
  buffetTypeId?: number;
  @BelongsTo(() => BuffetType, { as: 'buffetType', foreignKey: 'buffetTypeId' })
  buffetType?: BuffetType;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BuffetCost)
  buffetCostId?: number;
  @BelongsTo(() => BuffetCost, { as: 'buffetCost', foreignKey: 'buffetCostId' })
  buffetCost?: BuffetCost;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BuffetCity)
  cityId?: number;
  @BelongsTo(() => BuffetCity, { as: 'city', foreignKey: 'cityId' })
  city?: BuffetCity;

  isDeleted?: boolean;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  deletedBy?: bigint;
  @BelongsTo(() => User, { as: 'deletedByUser', foreignKey: 'deletedBy' })
  deletedByUser?: User;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  pin?: boolean;

  @BelongsToMany(() => CoffeOption, () => BuffetOption)
  coffeOptions?: CoffeOption[];

  @BelongsToMany(() => Attachment, () => BuffetGallery)
  buffetGalleries?: Attachment[];
}
