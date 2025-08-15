import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ECLogistic } from './ec-logistic.entity';
import { ECOrderShipmentWay } from './ec-order-shipmentway.entity';
import { ECProvince } from './ec-province.entity';
import { ECLogisticSendingPeriod } from './ec-logistic-sending-period.entity';

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
  })
  @ForeignKey(() => ECLogistic)
  logisticId: bigint;

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
}
