import { Module } from '@nestjs/common';
import { ECommmerceSmsService } from './ecommerce-sms.service';
import { SmsModule } from '@rahino/sms/sms.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECVendor } from '@rahino/database/models/ecommerce-eav/ec-vendor.entity';

@Module({
  imports: [
    SmsModule,
    SequelizeModule.forFeature([ECPayment, ECOrder, ECVendor]),
  ],
  providers: [ECommmerceSmsService],
  exports: [ECommmerceSmsService],
})
export class ECommerceSmsModule {}
