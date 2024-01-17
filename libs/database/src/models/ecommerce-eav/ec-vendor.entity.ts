import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECVendors' })
export class ECVendor extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  name: string;
  @Column({
    type: DataType.STRING,
  })
  slug: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDefault?: boolean;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priorityOrder?: number;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
