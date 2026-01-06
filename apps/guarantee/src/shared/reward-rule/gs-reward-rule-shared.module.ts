import { Module } from '@nestjs/common';
import { GSRewardRuleSharedService } from './reward-rule-shared.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSRewardRule,
  GSVipBundleType,
  GSAssignedGuarantee,
  GSGuarantee,
} from '@rahino/localdatabase/models';
import { RialPriceModule } from '../rial-price';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSRewardRule,
      GSVipBundleType,
      GSAssignedGuarantee,
      GSGuarantee,
    ]),
    RialPriceModule,
  ],
  providers: [GSRewardRuleSharedService],
  exports: [GSRewardRuleSharedService],
})
export class GSRewardRuleSharedModule {}
