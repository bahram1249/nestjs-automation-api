import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
  HasMany,
} from 'sequelize-typescript';
import { Attachment } from '@rahino/database';
import { User } from '@rahino/database';
import { AutoMap } from 'automapper-classes';
import { ECVendorUser } from './ec-vendor-user.entity';
import { ECVendorCommission } from './ec-vendor-commision.entity';
import { ECProvince } from './ec-province.entity';
import { ECCity } from './ec-city.entity';

@Table({ tableName: 'ECVendors' })
export class ECVendor extends Model {
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

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address?: string;

  @AutoMap()
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
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { foreignKey: 'userId', as: 'user' })
  user?: User;

  @AutoMap()
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

  @HasOne(() => ECVendorUser, { as: 'vendorUser', foreignKey: 'vendorId' })
  vendorUser?: ECVendorUser;

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

  @HasMany(() => ECVendorCommission, {
    foreignKey: 'vendorId',
    sourceKey: 'id',
  })
  commissions: ECVendorCommission[];

  @AutoMap()
  @Column({
    type: DataType.GEOGRAPHY('POINT', 4326),
    allowNull: true,
  })
  coordinates: any;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECProvince)
  provinceId?: number;

  @BelongsTo(() => ECProvince, { foreignKey: 'provinceId', as: 'province' })
  province?: ECProvince;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ForeignKey(() => ECCity)
  cityId?: number;

  @BelongsTo(() => ECCity, { foreignKey: 'cityId', as: 'city' })
  city?: ECCity;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @AutoMap()
  latitude?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @AutoMap()
  longitude?: string;
}
