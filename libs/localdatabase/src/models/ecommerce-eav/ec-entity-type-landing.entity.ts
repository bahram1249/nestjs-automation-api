import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECEntityTypeLandings' })
export class ECEntityTypeLanding extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING,
  })
  title: string;
  @Column({
    type: DataType.STRING,
  })
  slug: string;
  @Column({
    type: DataType.STRING,
  })
  jsonContent: string;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priority?: number;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  metaTitle?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  metaDescription?: string;
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  metaKeywords?: string;
  @Column({
    type: DataType.BIGINT,
  })
  userId: bigint;
  @Column({
    type: DataType.INTEGER,
  })
  entityTypeId: number;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
