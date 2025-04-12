import { Module } from '@nestjs/common';
import { SampleActionModule } from './sample-action';
import { NotificationSenderForNewIncomingCartableRequestActionModule } from './notification-sender-for-new-incoming-cartable-request-action';
import { NotificationSenderForTechnicalUserCartableRquestActionModule } from './notification-sender-for-technical-user-cartable-request-action';
import { NotificationSenderForClientShippingWayRequestActionModule } from './notification-sender-for-client-shipping-way-request-action';
import { NotificationSenderForClientTechnicalVisitTimeRequestActionModule } from './notification-sender-for-client-technical-visit-time-request-action';
import { UpdateRequestFactorToSucessActionModule } from './update-request-factor-to-success-action';
import { RemainingTransactionInCashActionModule } from './remaining-transaction-in-cash-action';

@Module({
  imports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
    NotificationSenderForTechnicalUserCartableRquestActionModule,
    NotificationSenderForClientShippingWayRequestActionModule,
    NotificationSenderForClientTechnicalVisitTimeRequestActionModule,
    UpdateRequestFactorToSucessActionModule,
    RemainingTransactionInCashActionModule,
  ],
  exports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
    NotificationSenderForTechnicalUserCartableRquestActionModule,
    NotificationSenderForClientShippingWayRequestActionModule,
    NotificationSenderForClientTechnicalVisitTimeRequestActionModule,
    UpdateRequestFactorToSucessActionModule,
    RemainingTransactionInCashActionModule,
  ],
})
export class DynamicGuaranteeActionModule {}
