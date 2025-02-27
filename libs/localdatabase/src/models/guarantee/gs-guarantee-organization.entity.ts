import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BPMNOrganization } from '../bpmn';
import { GSAddress } from './gs-address.entity';
import { User } from '@rahino/database';

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

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isNationWide?: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
