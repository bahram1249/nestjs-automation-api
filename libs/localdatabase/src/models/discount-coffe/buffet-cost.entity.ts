import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'DiscountCoffeBuffetCosts' })
export class BuffetCost extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  title: string;
}
