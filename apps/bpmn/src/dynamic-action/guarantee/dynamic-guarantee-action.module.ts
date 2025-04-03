import { Module } from '@nestjs/common';
import { SampleActionModule } from './sample-action';
import { NotificationSenderForNewIncomingCartableRequestActionModule } from './notification-sender-for-new-incoming-cartable-request-action';
import { NotificationSenderForTechnicalUserCartableRquestActionModule } from './notification-sender-for-technical-user-cartable-request-action';

@Module({
  imports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
    NotificationSenderForTechnicalUserCartableRquestActionModule,
  ],
  exports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
    NotificationSenderForTechnicalUserCartableRquestActionModule,
  ],
})
export class DynamicGuaranteeActionModule {}
