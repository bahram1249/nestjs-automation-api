import { Module } from '@nestjs/common';
import { AnonymousOrganizationService } from './organization.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSGuaranteeOrganization } from '@rahino/localdatabase/models';
import { OrganizationController } from './organization.controller';

@Module({
  imports: [SequelizeModule.forFeature([GSGuaranteeOrganization])],
  controllers: [OrganizationController],
  providers: [AnonymousOrganizationService],
  exports: [AnonymousOrganizationService],
})
export class AnonymousOrganizationModule {}
