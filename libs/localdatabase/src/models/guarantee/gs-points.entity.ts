import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({ tableName: 'GSPoints' })
export class GSPoint extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: false,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING,
  })
  title: string;
  @Column({
    type: DataType.DECIMAL(5, 2),
  })
  point: number;
}
