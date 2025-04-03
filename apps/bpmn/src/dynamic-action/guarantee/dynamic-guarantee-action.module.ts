import { Module } from '@nestjs/common';
import { SampleActionModule } from './sample-action';
import { NotificationSenderForNewIncomingCartableRequestActionModule } from './notification-sender-for-new-incoming-cartable-request-action';
import { NotificationSenderForSupervisorCartableRquestActionModule } from './notification-sender-for-supervisor-cartable-request-action';

@Module({
  imports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
    NotificationSenderForSupervisorCartableRquestActionModule,
  ],
  exports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
    NotificationSenderForSupervisorCartableRquestActionModule,
  ],
})
export class DynamicGuaranteeActionModule {}
