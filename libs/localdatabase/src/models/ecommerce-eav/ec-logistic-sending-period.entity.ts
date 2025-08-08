import { AutoMap } from 'automapper-classes';
import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECLogisticShipmentWay } from './ec-logistic-shipment-way.entity';
import { ECScheduleSendingType } from './ec-schedule-sending-type.entity';

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
    as: 'logisticShipmentWay',
    foreignKey: 'logisticShipmentWayId',
  })
  logisticShipmentWay: ECLogisticShipmentWay;

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
}
