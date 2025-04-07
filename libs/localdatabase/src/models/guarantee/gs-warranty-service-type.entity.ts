import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'GSWarrantyServiceTypes' })
export class GSWarrantyServiceType extends Model {
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
