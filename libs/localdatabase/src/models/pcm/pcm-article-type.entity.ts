import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class PCMArticleType extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  typeName: string;
}
