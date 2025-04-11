import { Module } from '@nestjs/common';
import { SubmitFactorInRequestLocationService } from './submit-factor-in-request-location.service';
import { SubmitFactorInRequestLocationController } from './submit-factor-in-request-location.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequest } from '@rahino/localdatabase/models';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
    SequelizeModule.forFeature([GSRequest]),
  ],
  controllers: [SubmitFactorInRequestLocationController],
  providers: [SubmitFactorInRequestLocationService],
  exports: [SubmitFactorInRequestLocationService],
})
export class SubmitFactorInRequestLocationModule {}
