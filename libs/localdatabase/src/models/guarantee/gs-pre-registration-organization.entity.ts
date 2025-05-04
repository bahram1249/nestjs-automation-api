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

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  title: string;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  addressId: bigint;

  @AutoMap()
  @Column({
    type: DataType.DATE,
  })
  licenseDate: Date;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  licenseAttachmentId: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  nationalAttachmentId: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  estateAttachmentId: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  postalAttachmentId: bigint;

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
}
