import { Module } from '@nestjs/common';
import { SampleActionModule } from './sample-action';
import { NotificationSenderForNewIncomingCartableRequestActionModule } from './notification-sender-for-new-incoming-cartable-request-action';
import { NotificationSenderForTechnicalUserCartableRquestActionModule } from './notification-sender-for-technical-user-cartable-request-action';
import { NotificationSenderForClientShippingWayRequestActionModule } from './notification-sender-for-client-shipping-way-request-action';
import { NotificationSenderForClientTechnicalVisitTimeRequestActionModule } from './notification-sender-for-client-technical-visit-time-request-action';

@Module({
  imports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
    NotificationSenderForTechnicalUserCartableRquestActionModule,
    NotificationSenderForClientShippingWayRequestActionModule,
    NotificationSenderForClientTechnicalVisitTimeRequestActionModule,
  ],
  exports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
    NotificationSenderForTechnicalUserCartableRquestActionModule,
    NotificationSenderForClientShippingWayRequestActionModule,
    NotificationSenderForClientTechnicalVisitTimeRequestActionModule,
  ],
})
export class DynamicGuaranteeActionModule {}
