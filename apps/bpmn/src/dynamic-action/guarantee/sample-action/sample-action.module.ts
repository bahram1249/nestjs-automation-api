import { Module } from '@nestjs/common';
import { SampleActionService } from './sample-action.service';

@Module({
  providers: [
    { provide: 'SampleActionService', useClass: SampleActionService },
  ],
})
export class SampleActionModule {}
