import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../core/user.entity';
import { ECVendor } from './ec-vendor.entity';

@Table({ tableName: 'ECVendorUsers' })
export class ECVendorUser extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  @ForeignKey(() => ECVendor)
  vendorId: number;

  @BelongsTo(() => ECVendor, { as: 'vendor', foreignKey: 'vendorId' })
  vendor?: ECVendor;

  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { foreignKey: 'userId', as: 'user' })
  user?: User;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDefault?: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
