import { AutoMap } from "automapper-classes";
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { GSProvider } from "./gs-provider.entity";
import { GSBrand } from "./gs-brand.entity";
import { GSGuaranteeType } from "./gs-guarantee-type.entity";
import { GSGuaranteePeriod } from "./gs-guarantee-period.entity";
import { GSGuaranteeConfirmStatus } from "./gs-guarantee-confirm-status.entity";
import { GSVariant } from "./gs-varaint.entity";

@Table({ tableName: "GSGuarantees" })
export class GSGuarantee extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSProvider)
  providerId?: number;

  @BelongsTo(() => GSProvider, { as: "provider", foreignKey: "providerId" })
  provider?: GSProvider;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSBrand)
  brandId?: number;

  @BelongsTo(() => GSBrand, { as: "brand", foreignKey: "brandId" })
  brand?: GSBrand;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSGuaranteeType)
  guaranteeTypeId: number;

  @BelongsTo(() => GSGuaranteeType, {
    as: "guaranteeType",
    foreignKey: "guaranteeTypeId",
  })
  guaranteeType?: GSGuaranteeType;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => GSGuaranteePeriod)
  guaranteePeriodId?: number;

  @BelongsTo(() => GSGuaranteePeriod, {
    as: "guaranteePeriod",
    foreignKey: "guaranteePeriodId",
  })
  guaranteePeriod?: GSGuaranteePeriod;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSGuaranteeConfirmStatus)
  guaranteeConfirmStatusId: number;

  @BelongsTo(() => GSGuaranteeConfirmStatus, {
    as: "guaranteeConfirmStatus",
    foreignKey: "guaranteeConfirmStatusId",
  })
  guaranteeCofirmStatus?: GSGuaranteeConfirmStatus;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  prefixSerial?: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  serialNumber: string;

  @AutoMap()
  @Column({
    type: DataType.DATE,
  })
  startDate: Date;

  @AutoMap()
  @Column({
    type: DataType.DATE,
  })
  endDate: Date;

  @AutoMap()
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  allowedDateEnterProduct?: Date;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  variantName?: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  providerBaseId?: number;

  @AutoMap()
  @Column({
    type: DataType.NUMBER,
    allowNull: true,
  })
  @ForeignKey(() => GSVariant)
  variantId: number;

  @BelongsTo(() => GSVariant, { as: "variant", foreignKey: "variantId" })
  variant?: GSVariant;
}
