import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Buffet } from './buffet.entity';
import { BuffetReserveStatus } from './buffet-reserve-status.entity';
import { User } from '../core/user.entity';
import { BuffetReserveType } from './buffet-reserve-type.entity';
import { Attachment } from '../core/attachment.entity';
import { PersianDate } from '../core/view/persiandate.entity';
import { BuffetReserveDetail } from './buffet-reserve-detail.entity';

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
  @ForeignKey(() => BuffetReserveType)
  reserveTypeId: number;

  @Column({
    type: DataType.INTEGER,
  })
  personCount: number;

  @BelongsTo(() => BuffetReserveType, {
    as: 'reserveType',
    foreignKey: 'reserveTypeId',
  })
  reserveType?: BuffetReserveType;

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

  @Column({
    type: DataType.DATE,
  })
  reserveDate: Date;
  @BelongsTo(() => PersianDate, {
    as: 'persianDate',
    foreignKey: 'reserveDate',
  })
  persianDate?: PersianDate;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  price?: bigint;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Attachment)
  attachmentId?: bigint;
  @BelongsTo(() => Attachment, { as: 'attachment', foreignKey: 'attachmentId' })
  attachment?: Attachment;
  @HasMany(() => BuffetReserveDetail, {
    as: 'details',
    foreignKey: 'reserveId',
  })
  details?: BuffetReserveDetail[];

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isQrScan?: boolean;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  qrScanDate?: Date;
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  qrScanBy?: bigint;

  @BelongsTo(() => User, { foreignKey: 'qrScanBy', as: 'qrScanByUser' })
  qrScanByUser?: User;
}
