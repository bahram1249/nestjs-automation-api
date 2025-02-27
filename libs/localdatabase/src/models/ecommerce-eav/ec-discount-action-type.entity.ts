import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECDiscountActionTypes' })
export class ECDiscountActionType extends Model {
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
  isDeleted?: boolean;
}
