import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Setting extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
    type: DataType.BIGINT,
  })
  id: bigint;

  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  key: string;
  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  value: string;
  @Column({
    allowNull: true,
    type: DataType.STRING,
  })
  type: string;
}
