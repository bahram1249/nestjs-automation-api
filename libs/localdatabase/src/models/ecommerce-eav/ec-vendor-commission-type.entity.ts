import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECVendorCommissionTypes' })
export class ECVendorCommissionType extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: false,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
