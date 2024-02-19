import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECVendor } from './ec-vendor.entity';
import { ECAddress } from './ec-address.entity';
import { User } from '@rahino/database/models/core/user.entity';

@Table({ tableName: 'ECVendorAddresses' })
export class ECVendorAddress extends Model {
  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
    autoIncrement: true,
  })
  id: bigint;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  @ForeignKey(() => ECVendor)
  vendorId: number;

  @BelongsTo(() => ECVendor, { as: 'vendor', foreignKey: 'vendorId' })
  vendor?: ECVendor;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  @ForeignKey(() => ECAddress)
  addressId: bigint;

  @BelongsTo(() => ECAddress, { as: 'address', foreignKey: 'addressId' })
  address?: ECAddress;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
