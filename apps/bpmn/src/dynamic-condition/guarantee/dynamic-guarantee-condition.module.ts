import { Module } from '@nestjs/common';
import { SampleConditionModule } from './sample-condition';
import { MandatoryAttendanceModule } from './mandatory-attendance';
import { NonMandatoryAttendanceModule } from './non-mandatory-attendance';
import { IsNoPaymentModule } from './is-no-payment';
import { IsOnlinePaymentModule } from './is-online-payment';

@Module({
  imports: [
    SampleConditionModule,
    MandatoryAttendanceModule,
    NonMandatoryAttendanceModule,
    IsNoPaymentModule,
    IsOnlinePaymentModule,
  ],
  exports: [
    SampleConditionModule,
    MandatoryAttendanceModule,
    NonMandatoryAttendanceModule,
    IsNoPaymentModule,
    IsOnlinePaymentModule,
  ],
})
export class DynamicGuaranteeConditionModule {}
