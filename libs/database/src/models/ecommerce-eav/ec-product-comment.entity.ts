import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { EAVEntity } from '../eav/eav-entity.entity';
import { ECProductCommentStatus } from './ec-comment-status.entity';
import { User } from '../core/user.entity';
import { ECProductCommentFactor } from './ec-product-comment-factor.entity';
@Table({ tableName: 'ECProductComments' })
export class ECProductComment extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => EAVEntity)
  entityId?: bigint;

  @BelongsTo(() => EAVEntity, { as: 'entity', foreignKey: 'entityId' })
  entity?: EAVEntity;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECProductCommentStatus)
  statusId?: number;

  @BelongsTo(() => ECProductCommentStatus, {
    as: 'status',
    foreignKey: 'statusId',
  })
  status?: ECProductCommentStatus;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  userId?: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => ECProductComment)
  replyId?: bigint;

  @BelongsTo(() => ECProductComment, { as: 'reply', foreignKey: 'replyId' })
  reply?: ECProductComment;

  @HasMany(() => ECProductComment, { as: 'replies', foreignKey: 'replyId' })
  replies?: ECProductComment[];

  @HasMany(() => ECProductCommentFactor, {
    as: 'commentFactors',
    foreignKey: 'commentId',
  })
  commentFactors?: ECProductCommentFactor[];
}
