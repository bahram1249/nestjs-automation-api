import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '@rahino/database';
import { ECVendor } from './ec-vendor.entity';

@Table({ tableName: 'ECCouriers' })
export class ECCourier extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.BIGINT,
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

  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  @ForeignKey(() => ECVendor)
  vendorId?: number;

  @BelongsTo(() => ECVendor, { foreignKey: 'vendorId', as: 'vendor' })
  vendor?: ECVendor;
}
