import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from 'sequelize-typescript';
import { GSRequestType } from './gs-request-type.entity';
import { GSRequestCategory } from './gs-request-category.entity';
import { GSBrand } from './gs-brand.entity';
import { GSVariant } from './gs-varaint.entity';
import { GSProductType } from './gs-product-type.entity';
import { GSGuaranteeOrganization } from './gs-guarantee-organization.entity';
import { BPMNOrganization } from '../bpmn';
import { GSGuarantee } from './gs-guarantee.entity';
import { User } from '@rahino/database';
import { GSAddress } from './gs-address.entity';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'GSRequests' })
export class GSRequest extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSRequestType)
  requestTypeId: number;

  @BelongsTo(() => GSRequestType, {
    as: 'requestType',
    foreignKey: 'requestTypeId',
  })
  requestType?: GSRequestType;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSRequestCategory)
  requestCategoryId: number;

  @BelongsTo(() => GSRequestCategory, {
    as: 'requestCategory',
    foreignKey: 'requestCategoryId',
  })
  requestCategory?: GSRequestCategory;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSBrand)
  brandId?: number;

  @BelongsTo(() => GSBrand, { as: 'brand', foreignKey: 'brandId' })
  brand?: GSBrand;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSVariant)
  variantId?: number;

  @BelongsTo(() => GSVariant, { as: 'variant', foreignKey: 'variantId' })
  variant?: GSVariant;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSProductType)
  productTypeId?: number;

  @BelongsTo(() => GSProductType, {
    as: 'productType',
    foreignKey: 'productTypeId',
  })
  productType?: GSProductType;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSGuaranteeOrganization)
  organizationId?: number;

  @BelongsTo(() => GSGuaranteeOrganization, {
    as: 'guaranteeOrganization',
    foreignKey: 'organizationId',
  })
  guaranteeOrganization?: GSGuaranteeOrganization;

  @BelongsTo(() => BPMNOrganization, {
    as: 'bpmnOrganization',
    foreignKey: 'organizationId',
  })
  bpmnOrganization?: BPMNOrganization;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => GSGuarantee)
  guaranteeId?: bigint;

  @BelongsTo(() => GSGuarantee, { as: 'guarantee', foreignKey: 'guaranteeId' })
  guarantee?: GSGuarantee;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneNumber?: string;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSAddress)
  addressId: bigint;

  @BelongsTo(() => GSAddress, { as: 'address', foreignKey: 'addressId' })
  address?: GSAddress;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  superVisorId?: bigint;

  @BelongsTo(() => User, { as: 'superVisor', foreignKey: 'superVisorId' })
  superVisor?: User;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  superVisorVisitDate?: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  superVisorVisitTime?: string;
}
