import { Module } from '@nestjs/common';
import { PickSupervisorService } from './pick-supervisor.service';
import { PickSupervisorController } from './pick-supervisor.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GSRequest } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([GSRequest]),
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
  ],
  controllers: [PickSupervisorController],
  providers: [PickSupervisorService],
  exports: [PickSupervisorService],
})
export class PickSupervisorModule {}
