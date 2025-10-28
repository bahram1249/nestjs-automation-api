import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'GSRequestItemTypes', timestamps: false })
export class GSRequestItemType extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  title: string;
}
