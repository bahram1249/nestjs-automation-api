import { Module } from '@nestjs/common';
import { ThankfullSuccessPaymentSmsSenderService } from 'apps/main/src/bpmn/services/thankfull-success-payment-sms-sender.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { THANKFULL_SUCCESS_PAYMENT_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/thankfull-success-payment-sms-sender/constants';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: THANKFULL_SUCCESS_PAYMENT_SMS_SENDER_QUEUE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
  ],
  providers: [ThankfullSuccessPaymentSmsSenderService],
  exports: [ThankfullSuccessPaymentSmsSenderService],
})
export class ThankfullSuccessPaymentSmsSenderActionModule {}
