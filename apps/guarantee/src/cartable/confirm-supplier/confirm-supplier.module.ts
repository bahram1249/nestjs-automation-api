import { Module } from '@nestjs/common';
import { ConfirmSupplierService } from './confirm-supplier.service';
import { ConfirmController } from './confirm-supplier.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GSRequestAttachment } from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';

@Module({
  imports: [
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
    SequelizeModule.forFeature([GSRequestAttachment, Attachment]),
  ],
  controllers: [ConfirmController],
  providers: [ConfirmSupplierService],
  exports: [ConfirmSupplierService],
})
export class ConfirmSupplierModule {}
