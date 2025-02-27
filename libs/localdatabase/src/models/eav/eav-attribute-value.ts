import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { EAVAttribute } from './eav-attribute.entity';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'EAVAttributeValues' })
export class EAVAttributeValue extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => EAVAttribute)
  attributeId: bigint;
  @BelongsTo(() => EAVAttribute, { foreignKey: 'attributeId', as: 'attribute' })
  attribute?: EAVAttribute;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  value: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  isDeleted?: boolean;
}
