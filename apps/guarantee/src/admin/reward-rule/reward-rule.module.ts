import { Module } from '@nestjs/common';
import { RewardRuleService } from './reward-rule.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSRewardRule,
  GSWarrantyReward,
  GSUnitPrice,
} from '@rahino/localdatabase/models';
import { Permission } from '@rahino/database';
import { RewardRuleController } from './reward-rule.controller';
import { RewardRuleProfile } from './mapper';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSRewardRule,
      GSWarrantyReward,
      GSUnitPrice,
      Permission,
    ]),
    LocalizationModule,
  ],
  controllers: [RewardRuleController],
  providers: [RewardRuleService, RewardRuleProfile],
  exports: [RewardRuleService],
})
export class GSRewardRuleModule {}
