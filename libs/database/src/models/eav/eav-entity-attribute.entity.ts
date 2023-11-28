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

@Table({ tableName: 'EAVAttributes' })
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
  @ForeignKey(() => EAVEntityType)
  attributeId: bigint;
  @BelongsTo(() => EAVEntityType, {
    as: 'attribute',
    foreignKey: 'attributeId',
  })
  attribute: EAVAttribute;
}
