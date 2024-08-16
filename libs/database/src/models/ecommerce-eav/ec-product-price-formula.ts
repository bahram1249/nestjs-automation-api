import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECProductPriceFormulas' })
export class ECProductPriceFormula extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  title: string;
}
