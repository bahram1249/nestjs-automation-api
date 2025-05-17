import { Module } from '@nestjs/common';
import { RevertRequestService } from './revert-request.service';
import { RevertRequestController } from './revert-request.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { BPMNRequest } from '@rahino/localdatabase/models';
import { BPMNRequestModule } from '@rahino/bpmn/modules/request/request.module';

@Module({
  imports: [
    SequelizeModule.forFeature([BPMNRequest]),
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
    BPMNRequestModule,
  ],
  controllers: [RevertRequestController],
  providers: [RevertRequestService],
  exports: [RevertRequestService],
})
export class RevertRequestModule {}
