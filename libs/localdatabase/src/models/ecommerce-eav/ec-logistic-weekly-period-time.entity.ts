import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ECLogisticWeeklyPeriod } from './ec-logistic-weekly-period.entity';

@Table({ tableName: 'ECLogisticWeeklyPeriodTimes' })
export class ECLogisticWeeklyPeriodTime extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECLogisticWeeklyPeriod)
  logisticWeeklyPeriodId: bigint;

  @BelongsTo(() => ECLogisticWeeklyPeriod, {
    as: 'logisticWeeklyPeriod',
    foreignKey: 'logisticWeeklyPeriodId',
  })
  logisticWeeklyPeriod?: ECLogisticWeeklyPeriod;

  @AutoMap()
  @Column({
    type: DataType.TIME,
  })
  startTime: string;
  @AutoMap()
  @Column({
    type: DataType.TIME,
  })
  endTime: string;
  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
