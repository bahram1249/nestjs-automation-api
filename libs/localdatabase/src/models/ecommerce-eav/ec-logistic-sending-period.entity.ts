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
    instance: ECLogisticSendingPeriod,
  ) {
    if (
      isNotNull(instance.weeklyPeriods) &&
      instance.weeklyPeriods.length > 0
    ) {
      for (const weeklyPeriod of instance.weeklyPeriods) {
        if (
          isNotNull(weeklyPeriod.weeklyPeriodTimes) &&
          weeklyPeriod.weeklyPeriodTimes.length > 0
        ) {
          for (const timeItem of weeklyPeriod.weeklyPeriodTimes) {
            // Format startTime
            if (timeItem.startTime) {
              timeItem.startTime = timeItem.startTime
                .split('T')[1]
                ?.split('.')[0]; // Format to HH:mm:ss
            }
            // Format endTime
            if (timeItem.endTime) {
              timeItem.endTime = timeItem.endTime.split('T')[1]?.split('.')[0]; // Format to HH:mm:ss
            }
          }
        }
      }
    }
  }
}
