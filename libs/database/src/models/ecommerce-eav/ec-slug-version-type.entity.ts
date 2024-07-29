import { Table, Model, Column, DataType } from 'sequelize-typescript';
@Table({ tableName: 'ECSlugVersionTypes' })
export class ECSlugVersionType extends Model {
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
