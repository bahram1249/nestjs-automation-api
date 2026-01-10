import { Module } from '@nestjs/common';
import { PayVipBundleController } from './pay-vip-bundle.controller';
import { PayVipBundleService } from './pay-vip-bundle.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSFactor,
  GSFactorVipBundle,
  GSVipBundleType,
  GSDiscountCode,
  GSTransaction,
  GSPaymentGateway,
} from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GSPaymentServiceProviderModule } from '@rahino/guarantee/shared/payment-provider/gs-payment-provider.module';
import { RialPriceModule } from '@rahino/guarantee/shared/rial-price';
import { GSDiscountCodeSharedModule } from '@rahino/guarantee/shared/discount-code/discount-code-shared.module';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([
      GSFactor,
      GSFactorVipBundle,
      GSVipBundleType,
      GSDiscountCode,
      GSTransaction,
      GSPaymentGateway,
    ]),
    LocalizationModule,
    GSPaymentServiceProviderModule,
    RialPriceModule,
    GSDiscountCodeSharedModule,
  ],
  controllers: [PayVipBundleController],
  providers: [PayVipBundleService],
  exports: [PayVipBundleService],
})
export class GSPayVipBundleModule {}
