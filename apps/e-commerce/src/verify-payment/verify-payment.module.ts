import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECPayment } from '@rahino/localdatabase/models';
import { VerifyPaymentController } from './verify-payment.controller';
import { VerifyPaymentService } from './veify-payment.service';
import { SnappayModule } from '../user/shopping/payment/provider/snappay.module';
import { ZarinPalModule } from '../user/shopping/payment/provider/zarinpal.module';
import { LogisticSnappayModule } from '../client/shopping-section/based-logistic/payment/provider/snappay.module';
import { LogisticZarinPalModule } from '../client/shopping-section/based-logistic/payment/provider/zarinpal.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ECPayment]),
    SnappayModule,
    ZarinPalModule,
    LogisticSnappayModule,
    LogisticZarinPalModule,
  ],
  controllers: [VerifyPaymentController],
  providers: [VerifyPaymentService],
})
export class VerifyPaymentModule {}
