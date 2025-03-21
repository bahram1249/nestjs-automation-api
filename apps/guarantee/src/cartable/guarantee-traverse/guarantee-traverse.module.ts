import { Module } from '@nestjs/common';
import { GuaranteeTraverseService } from './guarantee-traverse.service';
import { GSCartableModule } from '@rahino/guarantee/admin/cartable';
import { QueryFilterModule } from '@rahino/query-filter';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [LocalizationModule, GSCartableModule, QueryFilterModule],
  providers: [GuaranteeTraverseService],
  exports: [GuaranteeTraverseService],
})
export class GuaranteeTraverseModule {}
