import { Table, Column, Model, DataType, HasOne } from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ECLogisticUser } from './ec-logistic-user.entity';

@Table({ tableName: 'ECLogistics' })
export class ECLogistic extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  title: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @HasOne(() => ECLogisticUser, {
    as: 'logisticUser',
    foreignKey: 'logisticId',
  })
  logisticUser?: ECLogisticUser;
}
