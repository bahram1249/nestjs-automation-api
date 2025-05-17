import { AutoMap } from 'automapper-classes';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSAddress } from './gs-address.entity';
import { Attachment } from '@rahino/database';

@Table({ tableName: 'GSPreRegistrationOrganizations' })
export class GSPreRegistrationOrganization extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  title: string;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSAddress)
  addressId: bigint;

  @BelongsTo(() => GSAddress, { as: 'address', foreignKey: 'addressId' })
  address?: GSAddress;

  @AutoMap()
  @Column({
    type: DataType.DATE,
  })
  licenseDate: Date;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Attachment)
  licenseAttachmentId: bigint;

  @BelongsTo(() => Attachment, {
    as: 'licenseAttachment',
    foreignKey: 'licenseAttachmentId',
  })
  licenseAttachment?: Attachment;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Attachment)
  nationalAttachmentId: bigint;

  @BelongsTo(() => Attachment, {
    as: 'nationalAttachment',
    foreignKey: 'nationalAttachmentId',
  })
  nationalAttachment?: Attachment;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Attachment)
  estateAttachmentId: bigint;

  @BelongsTo(() => Attachment, {
    as: 'estateAttachment',
    foreignKey: 'estateAttachmentId',
  })
  estateAttachment?: Attachment;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Attachment)
  postalAttachmentId: bigint;

  @BelongsTo(() => Attachment, {
    as: 'postalAttachment',
    foreignKey: 'postalAttachmentId',
  })
  postalAttachment?: Attachment;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  postalCode: string;

  @Column({
    type: DataType.STRING,
  })
  firstname: string;

  @Column({
    type: DataType.STRING,
  })
  lastname: string;

  @Column({
    type: DataType.STRING,
  })
  phoneNumber: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isConfirm?: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  confirmDate: Date;

  @Column({
    type: DataType.STRING,
  })
  licenseCode: string;
}
