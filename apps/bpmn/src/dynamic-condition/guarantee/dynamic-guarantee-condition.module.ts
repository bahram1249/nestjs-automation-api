import { Module } from '@nestjs/common';
import { SampleConditionModule } from './sample-condition';
import { MandatoryAttendanceModule } from './mandatory-attendance';
import { NonMandatoryAttendanceModule } from './non-mandatory-attendance';
import { IsNoPaymentModule } from './is-no-payment';
import { IsOnlinePaymentModule } from './is-online-payment';
import { IsCashPaymentModule } from './is-cash-payment';

@Module({
  imports: [
    SampleConditionModule,
    MandatoryAttendanceModule,
    NonMandatoryAttendanceModule,
    IsNoPaymentModule,
    IsOnlinePaymentModule,
    IsCashPaymentModule,
  ],
  exports: [
    SampleConditionModule,
    MandatoryAttendanceModule,
    NonMandatoryAttendanceModule,
    IsNoPaymentModule,
    IsOnlinePaymentModule,
    IsCashPaymentModule,
  ],
})
export class DynamicGuaranteeConditionModule {}
