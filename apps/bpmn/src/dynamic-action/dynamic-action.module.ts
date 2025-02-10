import { Module } from '@nestjs/common';
import { DynamicGuaranteeActionModule } from './guarantee';

@Module({
  imports: [DynamicGuaranteeActionModule],
  exports: [DynamicGuaranteeActionModule],
})
export class DynamicActionModule {}
