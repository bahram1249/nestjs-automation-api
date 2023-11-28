import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { EAVAttributeType } from './eav-attribute-type.entity';

@Table({ tableName: 'EAVAttributes' })
export class EAVAttribute extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING,
  })
  name: string;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => EAVAttributeType)
  attributeTypeId: number;
  @BelongsTo(() => EAVAttributeType, {
    as: 'attributeType',
    foreignKey: 'attributeTypeId',
  })
  attributeType: EAVAttributeType;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  minLenth?: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  maxLength?: number;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  required?: boolean;
}
