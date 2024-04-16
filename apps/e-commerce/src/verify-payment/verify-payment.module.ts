import { Module } from '@nestjs/common';
import { VerifyPaymentController } from './verify-payment.controller';
import { VerifyPaymentService } from './veify-payment.service';
import { SnappayModule } from '../user/payment/provider/snappay.module';

@Module({
  imports: [SnappayModule],
  controllers: [VerifyPaymentController],
  providers: [VerifyPaymentService],
})
export class VerifyPaymentModule {}
