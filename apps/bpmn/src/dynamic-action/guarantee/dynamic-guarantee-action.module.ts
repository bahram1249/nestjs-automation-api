import { Module } from '@nestjs/common';
import { SampleActionModule } from './sample-action';
import { NotificationSenderForNewIncomingCartableRequestActionModule } from './notification-sender-for-new-incoming-cartable-request-action';

@Module({
  imports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
  ],
  exports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
  ],
})
export class DynamicGuaranteeActionModule {}
