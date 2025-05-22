import { AutoMap } from 'automapper-classes';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'GSSubscriptions' })
export class GSSubscription extends Model {
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
  phoneNumber: string;
}
