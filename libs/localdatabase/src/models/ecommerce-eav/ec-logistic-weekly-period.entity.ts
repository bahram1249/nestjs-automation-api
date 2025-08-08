import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ECLogisticSendingPeriod } from './ec-logistic-sending-period.entity';

@Table({ tableName: 'ECLogisticWeeklyPeriods' })
export class ECLogisticWeeklyPeriod extends Model {
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
}
