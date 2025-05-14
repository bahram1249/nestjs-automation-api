import { Module } from '@nestjs/common';
import { SampleActionModule } from './sample-action';
import { NotificationSenderForNewIncomingCartableRequestActionModule } from './notification-sender-for-new-incoming-cartable-request-action';
import { NotificationSenderForTechnicalUserCartableRquestActionModule } from './notification-sender-for-technical-user-cartable-request-action';
import { NotificationSenderForClientShippingWayRequestActionModule } from './notification-sender-for-client-shipping-way-request-action';
import { NotificationSenderForClientTechnicalVisitTimeRequestActionModule } from './notification-sender-for-client-technical-visit-time-request-action';
import { UpdateRequestFactorToSucessActionModule } from './update-request-factor-to-success-action';
import { RemainingTransactionInCashActionModule } from './remaining-transaction-in-cash-action';
import { UpdateRequestMandatoryAttendanceActionModule } from './update-request-mandatory-attendance-action';
import { ResetFactorActionModule } from './reset-factor-action';
import { PointInStartRequestActionModule } from './point-in-start-action';
import { PointInSurveyRequestActionModule } from './point-in-survey-action';
import { NotificationSenderForClientOnlinePaymentRequestActionModule } from './notification-sender-for-client-online-payment-request-action';
import { NotificationSenderForClientSurveyRequestActionModule } from './notification-sender-for-client-survey-request-action';
import { NotificationSenderForClientTechnicalStateRequestActionModule } from './notification-sender-for-client-technical-state-request-action';

@Module({
  imports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
    NotificationSenderForTechnicalUserCartableRquestActionModule,
    NotificationSenderForClientShippingWayRequestActionModule,
    NotificationSenderForClientTechnicalVisitTimeRequestActionModule,
    UpdateRequestFactorToSucessActionModule,
    RemainingTransactionInCashActionModule,
    UpdateRequestMandatoryAttendanceActionModule,
    ResetFactorActionModule,
    PointInStartRequestActionModule,
    PointInSurveyRequestActionModule,
    NotificationSenderForClientOnlinePaymentRequestActionModule,
    NotificationSenderForClientSurveyRequestActionModule,
    NotificationSenderForClientTechnicalStateRequestActionModule,
  ],
  exports: [
    SampleActionModule,
    NotificationSenderForNewIncomingCartableRequestActionModule,
    NotificationSenderForTechnicalUserCartableRquestActionModule,
    NotificationSenderForClientShippingWayRequestActionModule,
    NotificationSenderForClientTechnicalVisitTimeRequestActionModule,
    UpdateRequestFactorToSucessActionModule,
    RemainingTransactionInCashActionModule,
    UpdateRequestMandatoryAttendanceActionModule,
    ResetFactorActionModule,
    PointInStartRequestActionModule,
    PointInSurveyRequestActionModule,
    NotificationSenderForClientOnlinePaymentRequestActionModule,
    NotificationSenderForClientSurveyRequestActionModule,
    NotificationSenderForClientTechnicalStateRequestActionModule,
  ],
})
export class DynamicGuaranteeActionModule {}
