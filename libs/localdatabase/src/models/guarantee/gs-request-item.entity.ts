import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSRequest } from './gs-request.entity';
import { User } from '@rahino/database';
import { GSRequestItemType } from './gs-request-item-type.entity';

@Table({ tableName: 'GSRequestItems' })
export class GSRequestItem extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @ForeignKey(() => GSRequest)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  requestId: bigint;

  @BelongsTo(() => GSRequest, {
    as: 'request',
    foreignKey: 'requestId',
  })
  request?: GSRequest;

  @ForeignKey(() => User)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  userId: bigint;

  @BelongsTo(() => User, {
    as: 'user',
    foreignKey: 'userId',
  })
  user?: User;

  @ForeignKey(() => GSRequestItemType)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  requestItemTypeId: number;

  @BelongsTo(() => GSRequestItemType, {
    as: 'requestItemType',
    foreignKey: 'requestItemTypeId',
  })
  requestItemType?: GSRequestItemType;

  @Column({
    type: DataType.STRING(256),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING(256),
    allowNull: true,
  })
  barcode?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
