import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'PCMPublishes' })
export class PCMPublish extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  publishName: string;
}
