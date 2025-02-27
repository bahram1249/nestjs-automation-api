import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { EAVEntityType } from './eav-entity-type.entity';

@Table({ tableName: 'EAVEntities' })
export class EAVEntity extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  entityId: bigint;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => EAVEntityType)
  entityTypeId: number;

  @BelongsTo(() => EAVEntityType, {
    foreignKey: 'entityTypeId',
    as: 'entityType',
  })
  entityType?: EAVEntityType;
}
