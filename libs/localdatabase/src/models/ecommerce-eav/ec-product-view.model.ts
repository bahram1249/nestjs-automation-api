import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECProduct } from './ec-product.entity';
import { User } from '@rahino/database';

@Table({
  tableName: 'ECProductViews',
})
export class ECProductView extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: bigint;

  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  @ForeignKey(() => ECProduct)
  productId: bigint;

  @BelongsTo(() => ECProduct, { as: 'product' })
  product?: ECProduct;

  @Column({
    type: DataType.STRING,
  })
  sessionId: string;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId?: bigint;

  @BelongsTo(() => User, { as: 'user' })
  user?: User;
}
