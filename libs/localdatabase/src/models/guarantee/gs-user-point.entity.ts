import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSPoint } from './gs-points.entity';

@Table({ tableName: 'GSUserPoints' })
export class GSUserPoint extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSPoint)
  pointId: bigint;

  @BelongsTo(() => GSPoint, { as: 'point', foreignKey: 'pointId' })
  point: GSPoint;

  @Column({
    type: DataType.BIGINT,
  })
  userId: bigint;
  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  pointScore: number;
}
