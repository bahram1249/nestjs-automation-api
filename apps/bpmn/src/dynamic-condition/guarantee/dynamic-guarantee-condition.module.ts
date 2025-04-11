import { Module } from '@nestjs/common';
import { SampleConditionModule } from './sample-condition';
import { MandatoryAttendanceModule } from './mandatory-attendance';
import { NonMandatoryAttendanceModule } from './non-mandatory-attendance';
import { IsOnlineWithNoPaymentModule } from './isOnlineWithNoPayment';

@Module({
  imports: [
    SampleConditionModule,
    MandatoryAttendanceModule,
    NonMandatoryAttendanceModule,
    IsOnlineWithNoPaymentModule,
  ],
  exports: [
    SampleConditionModule,
    MandatoryAttendanceModule,
    NonMandatoryAttendanceModule,
    IsOnlineWithNoPaymentModule,
  ],
})
export class DynamicGuaranteeConditionModule {}
