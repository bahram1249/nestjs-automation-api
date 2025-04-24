import { Module } from '@nestjs/common';
import { PayVipBundleController } from './pay-vip-bundle.controller';
import { PayVipBundleService } from './pay-vip-bundle.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSFactor,
  GSFactorVipBundle,
  GSVipBundleType,
} from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GSPaymentServiceProviderModule } from '@rahino/guarantee/shared/payment-provider/gs-payment-provider.module';
import { RialPriceModule } from '@rahino/guarantee/shared/rial-price';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([GSVipBundleType, GSFactorVipBundle, GSFactor]),
    LocalizationModule,
    GSPaymentServiceProviderModule,
    RialPriceModule,
  ],
  controllers: [PayVipBundleController],
  providers: [PayVipBundleService],
  exports: [PayVipBundleService],
})
export class GSPayVipBundleModule {}
