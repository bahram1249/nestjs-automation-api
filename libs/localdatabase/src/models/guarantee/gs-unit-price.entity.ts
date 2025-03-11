import { AutoMap } from 'automapper-classes';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'GSUnitPrices' })
export class GSUnitPrice extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  title: string;
}
