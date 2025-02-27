import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECPaymentGatewayCommissionTypes' })
export class ECPaymentGatewayCommissionType extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  name: string;
}
