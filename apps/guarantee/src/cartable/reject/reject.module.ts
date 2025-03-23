import { Module } from '@nestjs/common';
import { RejectService } from './reject.service';
import { PickOrganizationController } from './reject.controller';
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
  controllers: [PickOrganizationController],
  providers: [RejectService],
  exports: [RejectService],
})
export class RejectModule {}
