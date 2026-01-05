import { Module } from '@nestjs/common';
import { DiscountCodeValidationService } from './discount-code-validation.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSDiscountCode,
  GSDiscountCodeUsage,
  GSPaymentGateway,
} from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { RialPriceModule } from '../rial-price';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSPaymentGateway,
      GSDiscountCodeUsage,
      GSDiscountCode,
    ]),
    LocalizationModule,
    RialPriceModule,
  ],
  providers: [DiscountCodeValidationService],
  exports: [DiscountCodeValidationService],
})
export class GSDiscountCodeSharedModule {}
