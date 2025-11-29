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
import { ECLogisticOrder } from './ec-logistic-order.entity';
import { ECLogistic } from './ec-logistic.entity';
import { ECLogisticShipmentWay } from './ec-logistic-shipment-way.entity';
import { ECLogisticSendingPeriod } from './ec-logistic-sending-period.entity';
import { ECLogisticWeeklyPeriod } from './ec-logistic-weekly-period.entity';
import { ECLogisticWeeklyPeriodTime } from './ec-logistic-weekly-period-time.entity';
import { ECOrderStatus } from './ec-order-status.entity';
import { ECOrderShipmentWay } from './ec-order-shipmentway.entity';
import { ECLogisticOrderGroupedDetail } from './ec-logistic-order-grouped-detail.entity';
import { User } from '@rahino/database';
import { isNotNull } from '@rahino/commontools';

@Table({ tableName: 'ECLogisticOrderGroupeds' })
export class ECLogisticOrderGrouped extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: bigint;

  @Column({ type: DataType.BIGINT })
  @ForeignKey(() => ECLogisticOrder)
  logisticOrderId: bigint;

  @BelongsTo(() => ECLogisticOrder, {
    as: 'logisticOrder',
    foreignKey: 'logisticOrderId',
  })
  logisticOrder?: ECLogisticOrder;

  @Column({ type: DataType.BIGINT })
  @ForeignKey(() => ECLogistic)
  logisticId: bigint;

  @BelongsTo(() => ECLogistic, { as: 'logistic', foreignKey: 'logisticId' })
  logistic?: ECLogistic;

  @Column({ type: DataType.BIGINT })
  @ForeignKey(() => ECLogisticShipmentWay)
  logisticShipmentWayId: bigint;

  @BelongsTo(() => ECLogisticShipmentWay, {
    as: 'logisticShipmentWay',
    foreignKey: 'logisticShipmentWayId',
  })
  logisticShipmentWay?: ECLogisticShipmentWay;

  // Direct cache of shipment way type for simpler filters (post/delivery/etc.)
  @Column({ type: DataType.INTEGER, allowNull: true })
  @ForeignKey(() => ECOrderShipmentWay)
  orderShipmentWayId?: number;

  @BelongsTo(() => ECOrderShipmentWay, {
    as: 'orderShipmentWay',
    foreignKey: 'orderShipmentWayId',
  })
  orderShipmentWay?: ECOrderShipmentWay;

  @Column({ type: DataType.BIGINT, allowNull: true })
  @ForeignKey(() => ECLogisticSendingPeriod)
  logisticSendingPeriodId?: bigint;

  @BelongsTo(() => ECLogisticSendingPeriod, {
    as: 'logisticSendingPeriod',
    foreignKey: 'logisticSendingPeriodId',
  })
  logisticSendingPeriod?: ECLogisticSendingPeriod;

  @Column({ type: DataType.BIGINT, allowNull: true })
  @ForeignKey(() => ECLogisticWeeklyPeriod)
  logisticWeeklyPeriodId?: bigint;

  @BelongsTo(() => ECLogisticWeeklyPeriod, {
    as: 'logisticWeeklyPeriod',
    foreignKey: 'logisticWeeklyPeriodId',
  })
  logisticWeeklyPeriod?: ECLogisticWeeklyPeriod;

  @Column({ type: DataType.BIGINT, allowNull: true })
  @ForeignKey(() => ECLogisticWeeklyPeriodTime)
  logisticWeeklyPeriodTimeId?: bigint;

  @BelongsTo(() => ECLogisticWeeklyPeriodTime, {
    as: 'logisticWeeklyPeriodTime',
    foreignKey: 'logisticWeeklyPeriodTimeId',
  })
  logisticWeeklyPeriodTime?: ECLogisticWeeklyPeriodTime;

  @Column({ type: DataType.INTEGER })
  @ForeignKey(() => ECOrderStatus)
  orderStatusId: number;

  @BelongsTo(() => ECOrderStatus, {
    as: 'orderStatus',
    foreignKey: 'orderStatusId',
  })
  orderStatus?: ECOrderStatus;

  @Column({ type: DataType.BIGINT, allowNull: true })
  totalProductPrice?: bigint;

  @Column({ type: DataType.BIGINT, allowNull: true })
  totalDiscountFee?: bigint;

  @Column({ type: DataType.BIGINT, allowNull: true })
  shipmentPrice?: bigint;

  @Column({ type: DataType.BIGINT, allowNull: true })
  realShipmentPrice?: bigint;

  @Column({ type: DataType.BIGINT, allowNull: true })
  totalPrice?: bigint;

  // Selected sending date (Gregorian). Optional; validated at payment time
  @Column({ type: DataType.DATE, allowNull: true })
  sendingGregorianDate?: Date;

  // Courier/post and delivery tracking fields (group-level)
  @Column({ type: DataType.BIGINT, allowNull: true })
  @ForeignKey(() => User)
  courierUserId?: bigint;

  @BelongsTo(() => User, { as: 'courierUser', foreignKey: 'courierUserId' })
  courierUser?: User;

  @Column({ type: DataType.STRING, allowNull: true })
  postReceipt?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  deliveryDate?: Date;

  @Column({ type: DataType.DATE, allowNull: true })
  sendToCustomerDate?: Date;

  @Column({ type: DataType.BIGINT, allowNull: true })
  sendToCustomerBy?: bigint;

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  isDeleted?: boolean;

  @HasMany(() => ECLogisticOrderGroupedDetail, {
    as: 'details',
    foreignKey: 'groupedId',
  })
  details?: ECLogisticOrderGroupedDetail[];

  @AfterFind
  static async formatAssociatedWeeklyPeriodTimes(
    instanceOrInstances: ECLogisticOrderGrouped | ECLogisticOrderGrouped[],
  ) {
    if (Array.isArray(instanceOrInstances)) {
      for (const instance of instanceOrInstances) {
        ECLogisticOrderGrouped.formatSingleInstance(instance);
      }
    } else {
      ECLogisticOrderGrouped.formatSingleInstance(instanceOrInstances);
    }
  }

  private static formatSingleInstance(instance: ECLogisticOrderGrouped) {
    if (isNotNull(instance) && isNotNull(instance.logisticWeeklyPeriodTime)) {
      const timeItem = instance.logisticWeeklyPeriodTime;
      if (timeItem.startTime) {
        timeItem.startTime = new Date(timeItem.startTime).toLocaleTimeString(
          'en-US',
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          },
        );
      }
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
