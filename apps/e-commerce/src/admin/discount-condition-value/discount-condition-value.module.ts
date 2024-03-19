import { Module } from '@nestjs/common';
import { ServiceProviderModule } from './provider/service-provider.module';
import { DiscountConditionValueController } from './discount-condition-value.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';

@Module({
  imports: [
    ServiceProviderModule,
    SequelizeModule.forFeature([User, Permission]),
  ],
  controllers: [DiscountConditionValueController],
})
export class DiscountConditionValueModule {}
