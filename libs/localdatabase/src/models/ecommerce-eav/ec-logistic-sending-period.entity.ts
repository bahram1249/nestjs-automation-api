import { AutoMap } from 'automapper-classes';
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  AfterFind,
} from 'sequelize-typescript';
import { ECLogisticShipmentWay } from './ec-logistic-shipment-way.entity';
import { ECScheduleSendingType } from './ec-schedule-sending-type.entity';
import { ECLogisticWeeklyPeriod } from './ec-logistic-weekly-period.entity';
import { isNotNull } from '@rahino/commontools';

@Table({ tableName: 'ECLogisticSendingPeriods' })
export class ECLogisticSendingPeriod extends Model {
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
  @ForeignKey(() => ECLogisticShipmentWay)
  logisticShipmentWayId: bigint;

  @BelongsTo(() => ECLogisticShipmentWay, {
    as: 'shipmentWay',
    foreignKey: 'logisticShipmentWayId',
  })
  shipmentWay: ECLogisticShipmentWay;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECScheduleSendingType)
  scheduleSendingTypeId: number;

  @BelongsTo(() => ECScheduleSendingType, {
    as: 'scheduleSendingType',
    foreignKey: 'scheduleSendingTypeId',
  })
  scheduleSendingType: ECScheduleSendingType;

  @AutoMap()
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDate?: Date;
  @AutoMap()
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate?: Date;
  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @HasMany(() => ECLogisticWeeklyPeriod, {
    as: 'weeklyPeriods',
    foreignKey: 'logisticSendingPeriodId',
  })
  weeklyPeriods?: ECLogisticWeeklyPeriod[];
  @AfterFind
  static async formatAssociatedWeeklyPeriodTimes(
    instanceOrInstances: ECLogisticSendingPeriod | ECLogisticSendingPeriod[],
  ) {
    if (Array.isArray(instanceOrInstances)) {
      for (const instance of instanceOrInstances) {
        ECLogisticSendingPeriod.formatSingleInstance(instance);
      }
    } else {
      ECLogisticSendingPeriod.formatSingleInstance(instanceOrInstances);
    }
  }

  private static formatSingleInstance(instance: ECLogisticSendingPeriod) {
    if (
      isNotNull(instance) &&
      isNotNull(instance.weeklyPeriods) &&
      instance.weeklyPeriods.length > 0
    ) {
      for (const weeklyPeriod of instance.weeklyPeriods) {
        if (
          isNotNull(weeklyPeriod.weeklyPeriodTimes) &&
          weeklyPeriod.weeklyPeriodTimes.length > 0
        ) {
          for (const timeItem of weeklyPeriod.weeklyPeriodTimes) {
            // Format startTime to HH:mm
            if (timeItem.startTime) {
              timeItem.startTime = new Date(
                timeItem.startTime,
              ).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
              });
            }
            // Format endTime to HH:mm
            if (timeItem.endTime) {
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
  }
}
