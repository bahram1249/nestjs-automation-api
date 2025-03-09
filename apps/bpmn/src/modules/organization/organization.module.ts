import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNOrganization } from '@rahino/localdatabase/models';
import { OrganizationService } from './organization.service';
import { OrganizationProfile } from './mapper';

@Module({
  imports: [SequelizeModule.forFeature([BPMNOrganization])],
  providers: [OrganizationService, OrganizationProfile],
  exports: [OrganizationService],
})
export class OrganizationModule {}
