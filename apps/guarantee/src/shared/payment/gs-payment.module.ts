import { Module } from '@nestjs/common';
import { GSSadadPaymentModule } from './sadad';

@Module({
  imports: [GSSadadPaymentModule],
})
export class GSPaymentModule {}
