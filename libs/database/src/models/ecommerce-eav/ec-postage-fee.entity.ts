import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECPostageFees' })
export class ECPostageFee extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.INTEGER,
  })
  fromWeight: number;
  @Column({
    type: DataType.INTEGER,
  })
  toWeight: number;
  @Column({
    type: DataType.BIGINT,
  })
  allProvincePrice: bigint;
}
