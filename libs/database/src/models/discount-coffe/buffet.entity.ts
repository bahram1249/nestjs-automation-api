import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../core/user.entity';

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
  coverAttachmentId?: bigint;
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
  bufferDescription?: string;
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
  buffetTypeId?: number;
}
