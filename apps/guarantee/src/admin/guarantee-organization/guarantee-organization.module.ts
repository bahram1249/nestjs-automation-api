import { Module } from '@nestjs/common';
import { GuaranteeOrganizationService } from './guarantee-organization.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNOrganizationUser,
  GSGuaranteeOrganization,
} from '@rahino/localdatabase/models';
import { GuaranteeOrganizationController } from './guarantee-organization.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GuaranteeOrganizationProfile } from './mapper';
import { OrganizationModule } from '@rahino/bpmn/modules/organization';
import { Permission, Role, User, UserRole } from '@rahino/database';
import { GSAddressModule } from '@rahino/guarantee/client/address/address.module';
import { BPMNOrganizationUserModule } from '@rahino/bpmn/modules/organization-user/organization-user.module';

@Module({
  imports: [
    LocalizationModule,
    OrganizationModule,
    SequelizeModule,
    GSAddressModule,
    SequelizeModule.forFeature([
      GSGuaranteeOrganization,
      User,
      Permission,
      UserRole,
      Role,
      BPMNOrganizationUser,
    ]),
    BPMNOrganizationUserModule,
  ],
  controllers: [GuaranteeOrganizationController],
  providers: [GuaranteeOrganizationService, GuaranteeOrganizationProfile],
  exports: [GuaranteeOrganizationService, GuaranteeOrganizationProfile],
})
export class GuaranteeOrganizationModule {}
