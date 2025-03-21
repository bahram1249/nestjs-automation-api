import { Module } from '@nestjs/common';
import { GuaranteeTraverseService } from './guarantee-traverse.service';
import { GSCartableModule } from '@rahino/guarantee/admin/cartable';
import { QueryFilterModule } from '@rahino/query-filter';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNRequest, BPMNRequestState } from '@rahino/localdatabase/models';

@Module({
  imports: [
    LocalizationModule,
    GSCartableModule,
    QueryFilterModule,
    SequelizeModule.forFeature([BPMNRequestState, BPMNRequest]),
  ],
  providers: [GuaranteeTraverseService],
  exports: [GuaranteeTraverseService],
})
export class GuaranteeTraverseModule {}
