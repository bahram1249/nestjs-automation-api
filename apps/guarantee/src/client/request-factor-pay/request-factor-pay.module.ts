import { Module } from '@nestjs/common';
import { RequestFactorPayService } from './request-factor-pay.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GSFactor, GSRequest } from '@rahino/localdatabase/models';
import { GuaranteeTraverseModule } from '@rahino/guarantee/cartable/guarantee-traverse/guarantee-traverse.module';
import { RequestFactorPayController } from './request-factor-pay.controller';
import { GSPaymentServiceProviderModule } from '@rahino/guarantee/shared/payment-provider/gs-payment-provider.module';
import { GSSharedFactorDetailAndRemainingAmountModule } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';

@Module({
  imports: [
    SequelizeModule.forFeature([GSRequest, GSFactor]),
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
    GSPaymentServiceProviderModule,
    GSSharedFactorDetailAndRemainingAmountModule,
  ],
  controllers: [RequestFactorPayController],
  providers: [RequestFactorPayService],
  exports: [RequestFactorPayService],
})
export class RequestFactorPayModule {}
