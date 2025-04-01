import { Module } from '@nestjs/common';
import { SampleConditionModule } from './sample-condition';
import { MandatoryAttendanceModule } from './mandatory-attendance';
import { NonMandatoryAttendanceModule } from './non-mandatory-attendance';

@Module({
  imports: [
    SampleConditionModule,
    MandatoryAttendanceModule,
    NonMandatoryAttendanceModule,
  ],
  exports: [
    SampleConditionModule,
    MandatoryAttendanceModule,
    NonMandatoryAttendanceModule,
  ],
})
export class DynamicGuaranteeConditionModule {}
