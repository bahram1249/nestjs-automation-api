import { Module } from '@nestjs/common';
import { OrganizationStuffService } from './organization-stuff.service';
import {
  BPMNOrganizationUser,
  GSGuaranteeOrganization,
} from '@rahino/localdatabase/models';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '@rahino/database';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([
      BPMNOrganizationUser,
      Role,
      GSGuaranteeOrganization,
    ]),
    LocalizationModule,
  ],
  providers: [OrganizationStuffService],
  exports: [OrganizationStuffService],
})
export class OrganizationStuffModule {}
