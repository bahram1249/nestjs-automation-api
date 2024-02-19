import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { EAVAttributeType } from './eav-attribute-type.entity';
import { AutoMap } from 'automapper-classes';
import { EAVAttributeValue } from './eav-attribute-value';

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
  @AutoMap()
  name: string;

  @AutoMap()
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

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  minLength?: number;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  maxLength?: number;

  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  required?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @HasMany(() => EAVAttributeValue, {
    as: 'attributeValues',
    foreignKey: 'attributeId',
  })
  attributeValues?: EAVAttributeValue[];
}
