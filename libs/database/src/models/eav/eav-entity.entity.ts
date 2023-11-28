import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'EAVEntities' })
export class EAVEntity extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
}
