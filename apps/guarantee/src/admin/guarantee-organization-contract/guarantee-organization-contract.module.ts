import { Module } from '@nestjs/common';
import { GuaranteeOrganizationContractService } from './guarantee-organization-contract.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSGuaranteeOrganizationContract } from '@rahino/localdatabase/models';
import { GuaranteeOrganizationContractController } from './guarantee-organization-contract.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GuaranteeOrganizationContractProfile } from './mapper';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [
    LocalizationModule,
    SequelizeModule.forFeature([
      User,
      Permission,
      GSGuaranteeOrganizationContract,
    ]),
  ],
  controllers: [GuaranteeOrganizationContractController],
  providers: [
    GuaranteeOrganizationContractService,
    GuaranteeOrganizationContractProfile,
  ],
  exports: [GuaranteeOrganizationContractService],
})
export class GuaranteeOrganizationContractModule {}
