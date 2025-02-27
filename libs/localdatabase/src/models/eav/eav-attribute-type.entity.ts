import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'EAVAttributeTypes' })
export class EAVAttributeType extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: false,
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
  valueBased?: boolean;
}
