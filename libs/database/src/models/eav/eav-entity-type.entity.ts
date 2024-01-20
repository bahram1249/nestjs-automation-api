import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { EAVEntityModel } from './eav-entity-model.entity';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'EAVEntityTypes' })
export class EAVEntityType extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  slug: string;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => EAVEntityType)
  parentEntityTypeId?: number;

  @BelongsTo(() => EAVEntityType, {
    as: 'parentEntity',
    foreignKey: 'parentEntityTypeId',
  })
  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => EAVEntityModel)
  entityModelId: number;
  @BelongsTo(() => EAVEntityModel, {
    as: 'entityModel',
    foreignKey: 'entityModelId',
  })
  entityModel?: EAVEntityModel;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
