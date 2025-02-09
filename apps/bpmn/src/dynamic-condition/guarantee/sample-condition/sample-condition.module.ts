import { Module } from '@nestjs/common';
import { SampleConditionService } from './sample-condition.service';

@Module({
  providers: [SampleConditionService],
  exports: [SampleConditionService],
})
export class SampleConditionModule {}
