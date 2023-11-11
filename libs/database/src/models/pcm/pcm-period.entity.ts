import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { PCMPeriodType } from './pcm-period-type.entity';

@Table
export class PCMPeriod extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
  })
  id: bigint;
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  periodTypeId: number;
  @Column({
    type: DataType.DATE,
    primaryKey: true,
  })
  startDate: Date;
  @Column({
    type: DataType.DATE,
    primaryKey: true,
  })
  endDate: Date;
  @Column({
    type: DataType.DATE,
  })
  endDateOffset: Date;

  @BelongsTo(() => PCMPeriodType, {
    foreignKey: 'periodTypeId',
    as: 'periodType',
  })
  periodType?: PCMPeriodType;
}
