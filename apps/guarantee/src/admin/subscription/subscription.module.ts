import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSSubscription } from '@rahino/localdatabase/models';
import { User, Permission } from '@rahino/database';
import { SubscriptionController } from './subscription.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([GSSubscription, User, Permission]),
    LocalizationModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class GSAdminSubscriptionModule {}
