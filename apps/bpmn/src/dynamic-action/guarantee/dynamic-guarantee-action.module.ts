import { Module } from '@nestjs/common';
import { SampleActionModule } from './sample-action';

@Module({
  imports: [SampleActionModule],
  exports: [SampleActionModule],
})
export class DynamicGuaranteeActionModule {}
