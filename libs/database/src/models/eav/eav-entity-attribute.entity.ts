import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { EAVEntityType } from './eav-entity-type.entity';
import { EAVAttribute } from './eav-attribute.entity';

@Table({ tableName: 'EAVEntityAttributes' })
export class EAVEntityAttribute extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  @ForeignKey(() => EAVEntityType)
  entityTypeId: number;
  @BelongsTo(() => EAVEntityType, {
    as: 'entityType',
    foreignKey: 'entityTypeId',
  })
  entityType: EAVEntityType;
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  @ForeignKey(() => EAVAttribute)
  attributeId: bigint;
  @BelongsTo(() => EAVAttribute, {
    as: 'attribute',
    foreignKey: 'attributeId',
  })
  attribute: EAVAttribute;
}
