import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECGuaranteeMonths' })
export class ECGuaranteeMonth extends Model {
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
    type: DataType.INTEGER,
  })
  monthCount: number;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
