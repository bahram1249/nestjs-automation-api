import { Module } from '@nestjs/common';
import { ECommmerceSmsService } from './ecommerce-sms.service';
import { SmsModule } from '@rahino/sms/sms.module';

@Module({
  imports: [SmsModule],
  providers: [ECommmerceSmsService],
  exports: [ECommmerceSmsService],
})
export class ECommerceSmsModule {}
