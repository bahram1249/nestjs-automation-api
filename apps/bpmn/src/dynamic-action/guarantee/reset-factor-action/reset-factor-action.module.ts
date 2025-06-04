import { Module } from '@nestjs/common';
import { ResetFactorActionService } from './reset-factor-action.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSFactor,
  GSGuarantee,
  GSPaymentGateway,
  GSRequest,
  GSTransaction,
} from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSFactor,
      GSPaymentGateway,
      GSTransaction,
      GSRequest,
      GSGuarantee,
    ]),
  ],
  providers: [
    { provide: 'ResetFactorActionService', useClass: ResetFactorActionService },
  ],
})
export class ResetFactorActionModule {}
