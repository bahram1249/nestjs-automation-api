import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  AllowNull,
} from 'sequelize-typescript';
import { BPMNOrganization } from '../bpmn';
import { GSAddress } from './gs-address.entity';
import { User } from '@rahino/database';
import { GSGuaranteeOrganizationContract } from './gs-guarantee-organization-contract.entity';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'GSGuaranteeOrganizations' })
export class GSGuaranteeOrganization extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: false,
    primaryKey: true,
  })
  @ForeignKey(() => BPMNOrganization)
  id: number;

  @BelongsTo(() => BPMNOrganization, {
    as: 'organization',
    foreignKey: 'id',
  })
  organization?: BPMNOrganization;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  @ForeignKey(() => GSAddress)
  addressId: bigint;

  @BelongsTo(() => GSAddress, { as: 'address', foreignKey: 'addressId' })
  address?: GSAddress;

  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isNationwide?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @AutoMap()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isOnlinePayment?: boolean;

  @AutoMap()
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  licenseDate?: Date;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  code?: string;

  @HasMany(() => GSGuaranteeOrganizationContract, {
    as: 'organizationContracts',
    foreignKey: 'organizationId',
    sourceKey: 'id',
  })
  organizationContracts?: GSGuaranteeOrganizationContract[];
}
