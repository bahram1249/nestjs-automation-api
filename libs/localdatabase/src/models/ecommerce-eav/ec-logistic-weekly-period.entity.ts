import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  AfterFind,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ECLogisticSendingPeriod } from './ec-logistic-sending-period.entity';
import { ECLogisticWeeklyPeriodTime } from './ec-logistic-weekly-period-time.entity';
import { isNotNull } from '@rahino/commontools';

@Table({ tableName: 'ECLogisticWeeklyPeriods' })
export class ECLogisticWeeklyPeriod extends Model {
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
  @ForeignKey(() => ECLogisticSendingPeriod)
  logisticSendingPeriodId: bigint;

  @BelongsTo(() => ECLogisticSendingPeriod, {
    as: 'logisticSendingPeriod',
    foreignKey: 'logisticSendingPeriodId',
  })
  logisticSendingPeriod?: ECLogisticSendingPeriod;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  weekNumber: number;
  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @HasMany(() => ECLogisticWeeklyPeriodTime, {
    as: 'weeklyPeriodTimes',
    foreignKey: 'logisticWeeklyPeriodId',
  })
  weeklyPeriodTimes?: ECLogisticWeeklyPeriodTime[];

  @AfterFind
  static async formatWeeklyPeriodTimes(
    instanceOrInstances: ECLogisticWeeklyPeriod | ECLogisticWeeklyPeriod[],
  ) {
    if (Array.isArray(instanceOrInstances)) {
      for (const instance of instanceOrInstances) {
        ECLogisticWeeklyPeriod.formatSingleInstance(instance);
      }
    } else {
      ECLogisticWeeklyPeriod.formatSingleInstance(instanceOrInstances);
    }
  }

  private static formatSingleInstance(instance: ECLogisticWeeklyPeriod) {
    if (
      isNotNull(instance) &&
      isNotNull(instance.weeklyPeriodTimes) &&
      instance.weeklyPeriodTimes.length > 0
    ) {
      for (const timeItem of instance.weeklyPeriodTimes) {
        if (isNotNull(timeItem.startTime)) {
          timeItem.startTime = new Date(timeItem.startTime).toLocaleTimeString(
            'en-US',
            {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            },
          );
        }
        if (isNotNull(timeItem.endTime)) {
          timeItem.endTime = new Date(timeItem.endTime).toLocaleTimeString(
            'en-US',
            {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            },
          );
        }
      }
    }
  }
}
