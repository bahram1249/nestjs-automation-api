import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECProductComment } from './ec-product-comment.entity';
import { EAVEntity } from '../eav/eav-entity.entity';
import { ECEntityTypeFactor } from './ec-entitytype-factor.entity';
@Table({ tableName: 'ECProductCommentFactors' })
export class ECProductCommentFactor extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECProductComment)
  commentId: bigint;

  @BelongsTo(() => ECProductComment, { as: 'comment', foreignKey: 'commentId' })
  comment?: ECProductComment;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => EAVEntity)
  entityId: bigint;

  @BelongsTo(() => EAVEntity, { as: 'entity', foreignKey: 'entityId' })
  entity?: EAVEntity;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECEntityTypeFactor)
  factorId: number;

  @BelongsTo(() => ECEntityTypeFactor, { as: 'factor', foreignKey: 'factorId' })
  factor?: ECEntityTypeFactor;

  @Column({
    type: DataType.INTEGER,
  })
  score: number;
}
