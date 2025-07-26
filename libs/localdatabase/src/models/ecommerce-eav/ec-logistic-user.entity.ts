import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AutoMap } from 'automapper-classes';
import { ECLogistic } from './ec-logistic.entity';
import { User } from '@rahino/database';

@Table({ tableName: 'ECLogisticUsers' })
export class ECLogisticUser extends Model {
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
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDefault?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
