import { Module } from '@nestjs/common';
import { SubmitFactorService } from './submit-factor.service';
import { SubmitFactorController } from './submit-factor.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
  ],
  controllers: [SubmitFactorController],
  providers: [SubmitFactorService],
  exports: [SubmitFactorService],
})
export class SubmitFactorModule {}
