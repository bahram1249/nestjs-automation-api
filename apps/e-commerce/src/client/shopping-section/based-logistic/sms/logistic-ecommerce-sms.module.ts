import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ECPayment,
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
  ECVendor,
  ECVendorUser,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { LogisticEcommerceSmsService } from './logistic-ecommerce-sms.service';
import { SmsModule } from '@rahino/sms/sms.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ECPayment,
      ECLogisticOrder,
      ECLogisticOrderGrouped,
      ECLogisticOrderGroupedDetail,
      ECVendor,
      ECVendorUser,
      User,
    ]),
    SmsModule,
  ],
  providers: [LogisticEcommerceSmsService],
  exports: [LogisticEcommerceSmsService],
})
export class LogisticEcommerceSmsModule {}
