import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSFactor,
  GSFactorService,
  GSGuaranteeOrganization,
  GSRequest,
  GSTransaction,
} from '@rahino/localdatabase/models';
import { GSSharedFactorDetailAndRemainingAmountService } from './factor-detail-and-remaining-amount.service';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { RialPriceModule } from '../rial-price';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSFactor,
      GSTransaction,
      GSRequest,
      GSFactorService,
      GSGuaranteeOrganization,
    ]),
    LocalizationModule,
    RialPriceModule,
  ],
  providers: [GSSharedFactorDetailAndRemainingAmountService],
  exports: [GSSharedFactorDetailAndRemainingAmountService],
})
export class GSSharedFactorDetailAndRemainingAmountModule {}
