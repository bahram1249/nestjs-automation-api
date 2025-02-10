import { Module } from '@nestjs/common';
import { DynamicGuaranteeConditionModule } from './guarantee';

// this module made only for exporting all files in dist folder

@Module({
  imports: [DynamicGuaranteeConditionModule],
  exports: [DynamicGuaranteeConditionModule],
})
export class DynamicConditionModule {}
