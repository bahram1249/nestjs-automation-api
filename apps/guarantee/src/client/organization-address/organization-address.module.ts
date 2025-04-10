import { Module } from '@nestjs/common';
import { OrganizationAddressService } from './organization-address.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNOrganization,
  GSAddress,
  GSGuaranteeOrganization,
  GSRequest,
} from '@rahino/localdatabase/models';
import { OrganizationAddressController } from './organization-address.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { QueryFilterModule } from '@rahino/query-filter';

@Module({
  imports: [
    SequelizeModule,
    LocalizationModule,
    SequelizeModule.forFeature([
      GSAddress,
      GSRequest,
      GSGuaranteeOrganization,
      BPMNOrganization,
    ]),
    QueryFilterModule,
  ],
  controllers: [OrganizationAddressController],
  providers: [OrganizationAddressService],
  exports: [OrganizationAddressService],
})
export class ClientOrganizationAddressModule {}
