import { Module } from '@nestjs/common';
import { CartableService } from './cartable.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Permission } from '@rahino/database';
import { CartableController } from './cartable.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { RoleModule } from '@rahino/core/user/role/role.module';
import { BPMNOrganizationUserModule } from '@rahino/bpmn/modules/organization-user/organization-user.module';
import { SharedCartableFilteringModule } from '@rahino/guarantee/shared/cartable-filtering/cartable-filtering.module';
import { GSTrackingRequestModule } from '@rahino/guarantee/admin/tracking-request';
import { CartableHistoryModule } from '@rahino/guarantee/cartable/history';
import { GSCartableFactorDetailAndRemainingAmountModule } from '@rahino/guarantee/cartable/factor-detail-and-amount-remaining';
import { CartablePdfService } from './cartable-pdf.service';

@Module({
  imports: [
    BPMNOrganizationUserModule,
    RoleModule,
    LocalizationModule,
    SequelizeModule.forFeature([User, Permission]),
    SharedCartableFilteringModule,
    GSTrackingRequestModule,
    CartableHistoryModule,
    GSCartableFactorDetailAndRemainingAmountModule,
  ],
  controllers: [CartableController],
  providers: [CartableService, CartablePdfService],
  exports: [CartableService],
})
export class GSCartableModule {}
