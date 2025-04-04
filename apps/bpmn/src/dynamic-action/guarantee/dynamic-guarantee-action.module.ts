import { Module } from '@nestjs/common';
import { SampleActionModule } from './sample-action';
import { NotificationSenderForNewIncomingCartableRequestActionModule } from './notification-sender-for-new-incoming-cartable-request-action';
import { NotificationSenderForTechnicalUserCartableRquestActionModule } from './notification-sender-for-technical-user-cartable-request-action';
import { NotificationSenderForClientShippingWayRequestActionModule } from './notification-sender-for-client-shipping-way-request-action';

@Module({
  imports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
    NotificationSenderForTechnicalUserCartableRquestActionModule,
    NotificationSenderForClientShippingWayRequestActionModule,
  ],
  exports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
    NotificationSenderForTechnicalUserCartableRquestActionModule,
    NotificationSenderForClientShippingWayRequestActionModule,
  ],
})
export class DynamicGuaranteeActionModule {}
