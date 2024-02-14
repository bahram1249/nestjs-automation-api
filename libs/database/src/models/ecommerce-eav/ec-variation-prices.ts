import { Table, Model, Column, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECVariationPrices' })
export class ECVariationPrice extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  name: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  required?: boolean;
}
