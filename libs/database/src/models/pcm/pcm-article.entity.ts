import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PCMArticleType } from './pcm-article-type.entity';
import { PCMAge } from './pcm-age.entity';
import { PCMPublish } from './pcm-publish.entity';
import { User } from '../core/user.entity';

@Table
export class PCMArticle extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING,
  })
  title?: string;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;
  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => PCMAge)
  ageId: number;
  @BelongsTo(() => PCMAge, { as: 'age', foreignKey: 'ageId' })
  age?: PCMAge;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => PCMPublish)
  publishId: number;
  @BelongsTo(() => PCMPublish, { as: 'publish', foreignKey: 'publishId' })
  publish?: PCMPublish;
  @Column({
    type: DataType.DATE,
  })
  publishDate?: Date;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  publishUserId?: bigint;
  @BelongsTo(() => User, { foreignKey: 'publishUserId', as: 'publishUser' })
  publishUser?: User;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => PCMArticleType)
  articleTypeId: number;
  @BelongsTo(() => PCMArticleType, {
    as: 'articleType',
    foreignKey: 'articleTypeId',
  })
  articleType?: PCMArticleType;
  @Column({
    type: DataType.BOOLEAN,
  })
  isDeleted?: boolean;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  deletedBy?: bigint;
  @BelongsTo(() => User, { as: 'deletedByUser', foreignKey: 'deletedBy' })
  deletedByUser?: User;
}
