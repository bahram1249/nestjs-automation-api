import { Module } from '@nestjs/common';
import { CartableAutoTraverseService } from './cartable-auto-traverse.service';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNRequest, BPMNRequestState } from '@rahino/localdatabase/models';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { CartableAutoTraverseController } from './cartable-auto-traverse.controller';

@Module({
  imports: [
    LocalizationModule,
    SequelizeModule.forFeature([BPMNRequestState, BPMNRequest]),
    TraverseModule,
  ],
  controllers: [CartableAutoTraverseController],
  providers: [CartableAutoTraverseService],
  exports: [CartableAutoTraverseService],
})
export class CartableAutoTraverseModule {}
