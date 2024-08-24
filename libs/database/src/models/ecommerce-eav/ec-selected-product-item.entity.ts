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

@Table({ tableName: 'ECSelectedProductItems' })
export class ECSelectedProductItem extends Model {
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

  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  @ForeignKey(() => ECProduct)
  productId: bigint;

  @BelongsTo(() => ECProduct, { as: 'product', foreignKey: 'productId' })
  product?: ECProduct;
}
