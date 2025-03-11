import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSAssignedGuarantee } from './gs-assigned-guarantee.entity';
import { GSProductType } from './gs-product-type.entity';
import { GSVariant } from './gs-varaint.entity';
import { GSBrand } from './gs-brand.entity';

@Table({ tableName: 'GSAssignedProductAssignedGuarantees' })
export class GSAssignedProductAssignedGuarantee extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSAssignedGuarantee)
  assignedGuaranteeId: bigint;

  @BelongsTo(() => GSAssignedGuarantee, {
    as: 'assignedGuarantee',
    foreignKey: 'assignedGuaranteeId',
  })
  assignedGuarantee?: GSAssignedGuarantee;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSProductType)
  productTypeId: number;

  @BelongsTo(() => GSProductType, {
    as: 'productType',
    foreignKey: 'productTypeId',
  })
  productType?: GSProductType;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSVariant)
  variantId: number;

  @BelongsTo(() => GSVariant, { as: 'variant', foreignKey: 'variantId' })
  variant?: GSVariant;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSBrand)
  brandId: number;

  @BelongsTo(() => GSBrand, { as: 'brand', foreignKey: 'brandId' })
  brand?: GSBrand;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
