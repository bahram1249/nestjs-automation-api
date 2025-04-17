import { Module } from '@nestjs/common';
import { RequestFactorService } from './request-factor.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNRequest,
  GSFactor,
  GSFactorService,
  GSGuarantee,
  GSGuaranteeOrganization,
  GSPaymentGateway,
  GSRequest,
  GSTransaction,
} from '@rahino/localdatabase/models';
import { RialPriceModule } from '../rial-price';
import { GSCartableSolutionModule } from '@rahino/guarantee/cartable/solution';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSRequest,
      BPMNRequest,
      GSFactor,
      GSFactorService,
      GSGuaranteeOrganization,
      GSTransaction,
      GSPaymentGateway,
      GSGuarantee,
    ]),
    LocalizationModule,
    GSCartableSolutionModule,
    RialPriceModule,
  ],
  providers: [RequestFactorService],
  exports: [RequestFactorService],
})
export class RequestFactorModule {}
