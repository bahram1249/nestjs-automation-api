import { Module } from '@nestjs/common';
import { VerifyPaymentController } from './verify-payment.controller';
import { VerifyPaymentService } from './veify-payment.service';
import { SnappayModule } from '../user/shopping/payment/provider/snappay.module';
import { ZarinPalModule } from '../user/shopping/payment/provider/zarinpal.module';

@Module({
  imports: [SnappayModule, ZarinPalModule],
  controllers: [VerifyPaymentController],
  providers: [VerifyPaymentService],
})
export class VerifyPaymentModule {}
