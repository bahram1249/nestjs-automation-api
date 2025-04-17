import { AutoMap } from 'automapper-classes';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSVipBundleType } from './gs-vip-bundle-types.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'GSVipGenerators' })
export class GSVipGenerator extends Model {
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
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSVipBundleType)
  vipBundleTypeId: number;

  @BelongsTo(() => GSVipBundleType, {
    as: 'vipBundleType',
    foreignKey: 'vipBundleTypeId',
  })
  vipBundleType?: GSVipBundleType;

  @Column({
    type: DataType.BOOLEAN,
  })
  isCompleted: boolean;
  @Column({
    type: DataType.INTEGER,
  })
  qty: number;
  @Column({
    type: DataType.BIGINT,
  })
  price: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  fee: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;
}
