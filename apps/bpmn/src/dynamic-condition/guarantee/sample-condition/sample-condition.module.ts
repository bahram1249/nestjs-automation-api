import { Module } from '@nestjs/common';
import { SampleConditionService } from './sample-condition.service';

@Module({
  imports: [],
  providers: [
    { provide: 'SampleConditionService', useClass: SampleConditionService },
  ],
})
export class SampleConditionModule {}
