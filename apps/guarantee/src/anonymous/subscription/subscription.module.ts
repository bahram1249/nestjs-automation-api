import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSSubscription } from '@rahino/localdatabase/models';
import { SubscriptionController } from './subscription.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [LocalizationModule, SequelizeModule.forFeature([GSSubscription])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class AnonymousSubscriptionModule {}
