import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECRequestLogs' })
export class ECRequestLog extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  userId?: bigint;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  sessionId?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  url?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ip?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  method?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  beginTime?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  endTime?: string;
}
