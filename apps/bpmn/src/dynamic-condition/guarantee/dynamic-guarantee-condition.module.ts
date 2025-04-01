import { Module } from '@nestjs/common';
import { SampleConditionModule } from './sample-condition';
import { MandatoryAttendanceModule } from './mandatory-attendance';

@Module({
  imports: [SampleConditionModule, MandatoryAttendanceModule],
  exports: [SampleConditionModule, MandatoryAttendanceModule],
})
export class DynamicGuaranteeConditionModule {}
