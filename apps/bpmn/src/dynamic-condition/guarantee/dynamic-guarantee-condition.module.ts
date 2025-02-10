import { Module } from '@nestjs/common';
import { SampleConditionModule } from './sample-condition';

@Module({
  imports: [SampleConditionModule],
  exports: [SampleConditionModule],
})
export class DynamicGuaranteeConditionModule {}
