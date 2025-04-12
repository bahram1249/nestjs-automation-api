import { Module } from '@nestjs/common';
import { SampleConditionModule } from './sample-condition';
import { MandatoryAttendanceModule } from './mandatory-attendance';
import { NonMandatoryAttendanceModule } from './non-mandatory-attendance';
import { IsNoPaymentModule } from './is-no-payment';

@Module({
  imports: [
    SampleConditionModule,
    MandatoryAttendanceModule,
    NonMandatoryAttendanceModule,
    IsNoPaymentModule,
  ],
  exports: [
    SampleConditionModule,
    MandatoryAttendanceModule,
    NonMandatoryAttendanceModule,
    IsNoPaymentModule,
  ],
})
export class DynamicGuaranteeConditionModule {}
