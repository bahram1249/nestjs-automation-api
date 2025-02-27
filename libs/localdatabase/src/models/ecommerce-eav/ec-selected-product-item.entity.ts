import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECSelectedProduct } from './ec-selected-product.entity';
import { ECProduct } from './ec-product.entity';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'ECSelectedProductItems' })
export class ECSelectedProductItem extends Model {
  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  @ForeignKey(() => ECSelectedProduct)
  selectedProductId: number;

  @BelongsTo(() => ECSelectedProduct, {
    as: 'selectedProduct',
    foreignKey: 'selectedProductId',
  })
  selectedProduct?: ECSelectedProduct;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  @ForeignKey(() => ECProduct)
  productId: bigint;

  @BelongsTo(() => ECProduct, { as: 'product', foreignKey: 'productId' })
  product?: ECProduct;
}
