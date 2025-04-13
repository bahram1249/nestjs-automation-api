import { Module } from '@nestjs/common';
import { PayAdditionalPackageController } from './pay-additional-package.controller';
import { PayAdditionalPackageService } from './pay-additional-package.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSAdditionalPackage,
  GSAssignedGuarantee,
  GSFactor,
  GSFactorAdditionalPackage,
} from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GSPaymentServiceProviderModule } from '@rahino/guarantee/shared/payment-provider/gs-payment-provider.module';
import { RialPriceModule } from '@rahino/guarantee/shared/rial-price';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([
      GSAdditionalPackage,
      GSFactorAdditionalPackage,
      GSFactor,
      GSAssignedGuarantee,
    ]),
    LocalizationModule,
    GSPaymentServiceProviderModule,
    RialPriceModule,
  ],
  controllers: [PayAdditionalPackageController],
  providers: [PayAdditionalPackageService],
  exports: [PayAdditionalPackageService],
})
export class GSPayAdditionalPackageModule {}
