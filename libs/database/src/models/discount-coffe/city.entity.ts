import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'DiscountCoffeCities' })
export class BuffetCity extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: false,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  title: string;
}
