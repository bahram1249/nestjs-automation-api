import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Buffet } from './buffet.entity';
import { BuffetReserveStatus } from './buffet-reserve-status.entity';
import { User } from '../core/user.entity';

@Table({ tableName: 'DiscountCoffeReserves' })
export class BuffetReserve extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId?: bigint;
  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => BuffetReserveStatus)
  reserveStatusId: number;
  @BelongsTo(() => BuffetReserveStatus, {
    as: 'reserveStatus',
    foreignKey: 'reserveStatusId',
  })
  reserveStatus?: BuffetReserveStatus;
  @Column({
    type: DataType.STRING,
  })
  uniqueCode?: string;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Buffet)
  buffetId: bigint;

  @BelongsTo(() => Buffet, { as: 'buffet', foreignKey: 'buffetId' })
  buffet?: Buffet;
}
