import { Module } from '@nestjs/common';
import { ServiceProviderModule } from './provider/service-provider.module';
import { DiscountConditionValueController } from './discount-condition-value.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';

@Module({
  imports: [
    ServiceProviderModule,
    SequelizeModule.forFeature([User, Permission]),
  ],
  controllers: [DiscountConditionValueController],
})
export class DiscountConditionValueModule {}
