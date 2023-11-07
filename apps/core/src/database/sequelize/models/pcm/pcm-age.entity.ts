import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class PCMAge extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  ageName: string;
  @Column({
    type: DataType.INTEGER,
  })
  minAge?: number;
  @Column({
    type: DataType.INTEGER,
  })
  maxAge?: number;
}
