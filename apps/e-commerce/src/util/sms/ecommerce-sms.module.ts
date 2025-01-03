import { Module } from '@nestjs/common';
import { ECommmerceSmsService } from './ecommerce-sms.service';
import { SmsModule } from '@rahino/sms/sms.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECOrder } from '@rahino/database';
import { ECPayment } from '@rahino/database';
import { ECVendor } from '@rahino/database';

@Module({
  imports: [
    SmsModule,
    SequelizeModule.forFeature([ECPayment, ECOrder, ECVendor]),
  ],
  providers: [ECommmerceSmsService],
  exports: [ECommmerceSmsService],
})
export class ECommerceSmsModule {}
