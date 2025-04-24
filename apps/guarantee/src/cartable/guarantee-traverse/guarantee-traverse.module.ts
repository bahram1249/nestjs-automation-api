import { Module } from '@nestjs/common';
import { GuaranteeTraverseService } from './guarantee-traverse.service';
import { GSCartableModule } from '@rahino/guarantee/admin/cartable';
import { QueryFilterModule } from '@rahino/query-filter';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNNode,
  BPMNNodeCommand,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { SharedCartableFilteringModule } from '@rahino/guarantee/shared/cartable-filtering/cartable-filtering.module';

@Module({
  imports: [
    LocalizationModule,
    SharedCartableFilteringModule,
    QueryFilterModule,
    SequelizeModule.forFeature([
      BPMNRequestState,
      BPMNRequest,
      BPMNNode,
      BPMNNodeCommand,
    ]),
  ],
  providers: [GuaranteeTraverseService],
  exports: [GuaranteeTraverseService],
})
export class GuaranteeTraverseModule {}
