import { Module } from '@nestjs/common';
import { ThankfullSuccessPaymentSmsSenderService } from './thankfull-success-payment-sms-sender.service';

@Module({
  providers: [ThankfullSuccessPaymentSmsSenderService],
  exports: [ThankfullSuccessPaymentSmsSenderService],
})
export class BpmnServicesModule {}
