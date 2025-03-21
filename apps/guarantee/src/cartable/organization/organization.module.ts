import { Module } from '@nestjs/common';
import { CartableOrganizationService } from './organization.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSGuaranteeOrganization,
  GSRequest,
} from '@rahino/localdatabase/models';
import { OrganizationController } from './organization.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule.forFeature([GSGuaranteeOrganization, GSRequest]),
    LocalizationModule,
  ],
  controllers: [OrganizationController],
  providers: [CartableOrganizationService],
  exports: [CartableOrganizationService],
})
export class CartableOrganizationModule {}
