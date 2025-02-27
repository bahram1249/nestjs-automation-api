import { Module } from '@nestjs/common';
import { ECommmerceSmsService } from './ecommerce-sms.service';
import { SmsModule } from '@rahino/sms/sms.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECOrder } from '@rahino/localdatabase/models';
import { ECPayment } from '@rahino/localdatabase/models';
import { ECVendor } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SmsModule,
    SequelizeModule.forFeature([ECPayment, ECOrder, ECVendor]),
  ],
  providers: [ECommmerceSmsService],
  exports: [ECommmerceSmsService],
})
export class ECommerceSmsModule {}
