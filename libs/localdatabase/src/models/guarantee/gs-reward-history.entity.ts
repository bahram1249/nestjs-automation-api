import { AutoMap } from 'automapper-classes';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '@rahino/database';
import { GSGuarantee } from './gs-guarantee.entity';
import { GSRewardRule } from './gs-reward-rule.entity';
import { GSUnitPrice } from './gs-unit-price.entity';

@Table({ tableName: 'GSRewardHistories' })
export class GSRewardHistory extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSGuarantee)
  guaranteeId: bigint;

  @BelongsTo(() => GSGuarantee, { as: 'guarantee', foreignKey: 'guaranteeId' })
  guarantee?: GSGuarantee;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSRewardRule)
  rewardRuleId: bigint;

  @BelongsTo(() => GSRewardRule, {
    as: 'rewardRule',
    foreignKey: 'rewardRuleId',
  })
  rewardRule?: GSRewardRule;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSGuarantee)
  rewardGuaranteeId: bigint;

  @BelongsTo(() => GSGuarantee, {
    as: 'rewardGuarantee',
    foreignKey: 'rewardGuaranteeId',
  })
  rewardGuarantee?: GSGuarantee;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSUnitPrice)
  unitPriceId: number;

  @BelongsTo(() => GSUnitPrice, { as: 'unitPrice', foreignKey: 'unitPriceId' })
  unitPrice?: GSUnitPrice;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  originalGuaranteeSerialNumber: string;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  rewardAmount: bigint;

  @AutoMap()
  @Column({
    type: DataType.DATE,
  })
  rewardDate: Date;
}
