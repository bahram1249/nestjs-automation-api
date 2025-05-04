import { Module } from '@nestjs/common';
import { PreRegistrationOrganizationService } from './pre-registration-organization.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSPreRegistrationOrganization } from '@rahino/localdatabase/models';
import { Permission, User } from '@rahino/database';
import { PreRegistrationOrganizationController } from './pre-registration-organization.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GuaranteeOrganizationModule } from '../guarantee-organization';
import { GuaranteeOrganizationContractModule } from '../guarantee-organization-contract';

@Module({
  imports: [
    GuaranteeOrganizationModule,
    GuaranteeOrganizationContractModule,
    LocalizationModule,
    SequelizeModule.forFeature([
      GSPreRegistrationOrganization,
      User,
      Permission,
    ]),
  ],
  controllers: [PreRegistrationOrganizationController],
  providers: [PreRegistrationOrganizationService],
  exports: [PreRegistrationOrganizationService],
})
export class AdminPreRegistrationOrganizationModule {}
