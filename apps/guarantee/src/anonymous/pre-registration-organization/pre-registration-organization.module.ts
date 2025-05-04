import { Module } from '@nestjs/common';
import { PreRegistrationOrganizationService } from './pre-registration-organization.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSPreRegistrationOrganization } from '@rahino/localdatabase/models';
import { PreRegistrationOrganizationController } from './pre-registration-organization.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { PreRegistrationOrganizationProfile } from './mapper';
import { Attachment } from '@rahino/database';
import { GSAddressModule } from '@rahino/guarantee/client/address/address.module';

@Module({
  imports: [
    LocalizationModule,
    SequelizeModule,
    GSAddressModule,
    SequelizeModule.forFeature([GSPreRegistrationOrganization, Attachment]),
  ],
  controllers: [PreRegistrationOrganizationController],
  providers: [
    PreRegistrationOrganizationService,
    PreRegistrationOrganizationProfile,
  ],
})
export class AnonymousPreRegistrationOrganizationModule {}
