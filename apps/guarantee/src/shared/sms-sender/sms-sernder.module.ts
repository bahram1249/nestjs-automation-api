import { Module } from '@nestjs/common';
import { SmsSenderService } from './sms-sender.service';

@Module({
  providers: [SmsSenderService],
  exports: [SmsSenderService],
})
export class SmsSenderModule {}
