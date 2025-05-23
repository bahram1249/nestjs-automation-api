import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'GSProvinces' })
export class GSProvince extends Model {
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
    type: DataType.STRING,
  })
  slug: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  order?: number;

  @Column({
    type: DataType.GEOGRAPHY('POLYGON'),
    allowNull: false,
  })
  geographyPolygon: any;
}
