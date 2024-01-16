import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { EAVAttribute } from './eav-attribute.entity';

@Table({ tableName: 'EAVAttributeValues' })
export class EAVAttributeValue extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  bigint: number;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => EAVAttribute)
  attributeId: bigint;
  @BelongsTo(() => EAVAttribute, { foreignKey: 'attributeId', as: 'attribute' })
  attribute?: EAVAttribute;

  @Column({
    type: DataType.STRING,
  })
  value: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  isDeleted?: boolean;
}
