import { Module } from '@nestjs/common';
import { AnonymousOrganizationService } from './organization.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNRequestState,
  GSGuaranteeOrganization,
  GSRequest,
  GSResponse,
} from '@rahino/localdatabase/models';
import { OrganizationController } from './organization.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([
      GSGuaranteeOrganization,
      GSRequest,
      GSResponse,
      BPMNRequestState,
    ]),
    LocalizationModule,
  ],
  controllers: [OrganizationController],
  providers: [AnonymousOrganizationService],
  exports: [AnonymousOrganizationService],
})
export class AnonymousOrganizationModule {}
