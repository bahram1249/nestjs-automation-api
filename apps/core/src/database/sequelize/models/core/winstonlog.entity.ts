import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class WinstonLog extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING,
  })
  level?: string;
  @Column({
    type: DataType.STRING,
  })
  message?: string;
  @Column({
    type: DataType.STRING,
  })
  meta?: string;
}
