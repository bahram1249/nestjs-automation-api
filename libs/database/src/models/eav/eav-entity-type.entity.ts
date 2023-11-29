import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { EAVEntityModel } from './eav-entity-model.entity';

@Table({ tableName: 'EAVEntityTypes' })
export class EAVEntityType extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
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
  @ForeignKey(() => EAVEntityType)
  parentEntityTypeId?: number;
  @BelongsTo(() => EAVEntityType, {
    as: 'parentEntity',
    foreignKey: 'parentEntityTypeId',
  })
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
}
