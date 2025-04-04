import { Module } from '@nestjs/common';
import { ConfirmService } from './confirm.service';
import { ConfirmController } from './confirm.controller';
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
  controllers: [ConfirmController],
  providers: [ConfirmService],
  exports: [ConfirmService],
})
export class ConfirmModule {}
