import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../core/user.entity';
import { ECProduct } from './ec-product.entity';
@Table({ tableName: 'ECProductFavorites' })
export class ECProductFavorite extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  productId: bigint;

  @Column({
    type: DataType.VIRTUAL,
  })
  product?: ECProduct;
}
