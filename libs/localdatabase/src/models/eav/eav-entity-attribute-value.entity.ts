import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { EAVAttribute } from './eav-attribute.entity';
import { EAVEntity } from './eav-entity.entity';
import { EAVAttributeValue } from './eav-attribute-value';

@Table({ tableName: 'EAVEntityAttributeValues' })
export class EAVEntityAttributeValue extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  @ForeignKey(() => EAVEntity)
  entityId: bigint;

  @BelongsTo(() => EAVEntity, { foreignKey: 'entityId', as: 'entity' })
  entity?: EAVEntity;

  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  @ForeignKey(() => EAVAttribute)
  attributeId: bigint;

  @BelongsTo(() => EAVAttribute, { foreignKey: 'attributeId', as: 'attribute' })
  attribute?: EAVAttribute;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  val?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => EAVAttributeValue)
  attributeValueId?: bigint;

  @BelongsTo(() => EAVAttributeValue, {
    foreignKey: 'attributeValueId',
    as: 'attributeValue',
  })
  attributeValue?: EAVAttributeValue;
}
