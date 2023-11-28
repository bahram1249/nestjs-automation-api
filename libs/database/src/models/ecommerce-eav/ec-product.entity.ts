import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
} from 'sequelize-typescript';
import { EAVEntity } from '../eav/eav-entity.entity';

@Table({ tableName: 'ECProducts' })
export class ECProduct extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: false,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING,
  })
  name: string;
  @BelongsTo(() => EAVEntity, { as: 'entity', foreignKey: 'id' })
  entity?: EAVEntity;
}
