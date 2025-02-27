import { Module } from '@nestjs/common';
import { DiscountActionRuleController } from './discount-action-rule.controller';
import { DiscountActionRuleService } from './discount-action-rule.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECDiscountActionRule } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([ECDiscountActionRule])],
  controllers: [DiscountActionRuleController],
  providers: [DiscountActionRuleService],
})
export class DiscountActionRuleModule {}
