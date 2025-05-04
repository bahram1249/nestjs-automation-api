import { AutoMap } from 'automapper-classes';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'GSPreRegistrationOrganizations' })
export class GSPreRegistrationOrganization extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING,
  })
  title: string;
  @Column({
    type: DataType.BIGINT,
  })
  addressId: bigint;
  @Column({
    type: DataType.DATE,
  })
  licenseDate: Date;
  @Column({
    type: DataType.BIGINT,
  })
  licenseAttachmentId: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  nationalAttachmentId: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  estateAttachmentId: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  postalAttachmentId: bigint;
  @Column({
    type: DataType.STRING,
  })
  postalCode: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
