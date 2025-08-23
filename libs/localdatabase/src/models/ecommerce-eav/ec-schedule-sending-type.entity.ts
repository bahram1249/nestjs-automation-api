import { AutoMap } from 'automapper-classes';
import {
  Table,
  Model,
  Column,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';

@Table({ tableName: 'ECScheduleSendingTypes' })
export class ECScheduleSendingType extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  title: string;
  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  icon?: string;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  parentId?: number;

  @BelongsTo(() => ECScheduleSendingType, {
    as: 'parent',
    foreignKey: 'parentId',
  })
  parent?: ECScheduleSendingType;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  offsetDay?: number;
}
