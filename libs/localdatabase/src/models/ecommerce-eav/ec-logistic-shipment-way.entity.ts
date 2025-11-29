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
import { ECLogistic } from './ec-logistic.entity';
import { ECOrderShipmentWay } from './ec-order-shipmentway.entity';
import { ECProvince } from './ec-province.entity';
import { ECLogisticSendingPeriod } from './ec-logistic-sending-period.entity';
import { isNotNull } from '@rahino/commontools';

@Table({ tableName: 'ECLogisticShipmentWays' })
export class ECLogisticShipmentWay extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => ECLogistic)
  logisticId?: bigint;

  @BelongsTo(() => ECLogistic, { as: 'logistic', foreignKey: 'logisticId' })
  logistic?: ECLogistic;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECOrderShipmentWay)
  orderShipmentWayId: number;

  @BelongsTo(() => ECOrderShipmentWay, {
    as: 'orderShipmentWay',
    foreignKey: 'orderShipmentWayId',
  })
  orderShipmentWay?: ECOrderShipmentWay;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECProvince)
  provinceId?: number;

  @BelongsTo(() => ECProvince, { as: 'province', foreignKey: 'provinceId' })
  province?: ECProvince;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @HasMany(() => ECLogisticSendingPeriod, {
    as: 'sendingPeriods',
    foreignKey: 'logisticShipmentWayId',
  })
  sendingPeriods?: ECLogisticSendingPeriod[];

  @AfterFind
  static async formatAssociatedWeeklyPeriodTimes(
    instanceOrInstances: ECLogisticShipmentWay | ECLogisticShipmentWay[],
  ) {
    if (Array.isArray(instanceOrInstances)) {
      for (const instance of instanceOrInstances) {
        ECLogisticShipmentWay.formatSingleInstance(instance);
      }
    } else {
      ECLogisticShipmentWay.formatSingleInstance(instanceOrInstances);
    }
  }

  private static formatSingleInstance(instance: ECLogisticShipmentWay) {
    if (
      isNotNull(instance) &&
      isNotNull(instance.sendingPeriods) &&
      instance.sendingPeriods.length > 0
    ) {
      for (const sendingPeriod of instance.sendingPeriods) {
        if (
          isNotNull(sendingPeriod.weeklyPeriods) &&
          sendingPeriod.weeklyPeriods.length > 0
        ) {
          for (const weeklyPeriod of sendingPeriod.weeklyPeriods) {
            for (const timeItem of weeklyPeriod.weeklyPeriodTimes) {
              // Format startTime
              if (timeItem.startTime) {
                timeItem.startTime = new Date(
                  timeItem.startTime,
                ).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                });
              }
              // Format endTime
              if (timeItem.endTime) {
                timeItem.endTime = timeItem.endTime = new Date(
                  timeItem.endTime,
                ).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                });
              }
            }
          }
        }
      }
    }
  }
}
