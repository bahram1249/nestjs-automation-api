import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AfterFind,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ECLogisticWeeklyPeriod } from './ec-logistic-weekly-period.entity';
import { isNotNull } from '@rahino/commontools';

@Table({ tableName: 'ECLogisticWeeklyPeriodTimes' })
export class ECLogisticWeeklyPeriodTime extends Model {
  @AutoMap()
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

  @AutoMap()
  @Column({
    type: DataType.NUMBER,
  })
  capacity: number;

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

  // Hook to format startTime and endTime after finding records
  @AfterFind
  static formatTimeFields(instance: ECLogisticWeeklyPeriodTime) {
    if (isNotNull(instance)) {
      if (instance.startTime) {
        instance.startTime = instance.startTime.split('T')[1]?.split('.')[0]; // Format to HH:mm:ss
      }
      if (instance.endTime) {
        instance.endTime = instance.endTime.split('T')[1]?.split('.')[0]; // Format to HH:mm:ss
      }
    }
  }
}
