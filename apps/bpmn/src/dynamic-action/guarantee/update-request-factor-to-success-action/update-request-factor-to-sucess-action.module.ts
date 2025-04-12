import { Module } from '@nestjs/common';
import { UpdateRequestFactorToSucessActionService } from './update-request-factor-to-sucess-action.service';
import { GSSharedFactorDetailAndRemainingAmountModule } from '@rahino/guarantee/shared/factor-detail-and-remaining-amount';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSFactor } from '@rahino/localdatabase/models';

@Module({
  imports: [
    GSSharedFactorDetailAndRemainingAmountModule,
    SequelizeModule.forFeature([GSFactor]),
  ],
  providers: [
    {
      provide: 'UpdateRequestFactorToSucessActionService',
      useClass: UpdateRequestFactorToSucessActionService,
    },
  ],
})
export class UpdateRequestFactorToSucessActionModule {}
