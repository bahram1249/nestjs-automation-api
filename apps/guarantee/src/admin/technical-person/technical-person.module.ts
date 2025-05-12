import { Module } from '@nestjs/common';
import { TechnicalPersonService } from './technical-person.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNOrganizationUser,
  GSTechnicalPerson,
} from '@rahino/localdatabase/models';
import { User, Permission, UserRole, Role } from '@rahino/database';
import { TechnicalPersonController } from './technical-person.controller';
import { TechnicalPersonProfile } from './mapper';
import { OrganizationStuffModule } from '@rahino/guarantee/shared/organization-stuff';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { BPMNOrganizationUserModule } from '@rahino/bpmn/modules/organization-user/organization-user.module';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([
      GSTechnicalPerson,
      User,
      Permission,
      UserRole,
      Role,
      BPMNOrganizationUser,
    ]),
    LocalizationModule,
    OrganizationStuffModule,
    BPMNOrganizationUserModule,
  ],
  controllers: [TechnicalPersonController],
  providers: [TechnicalPersonService, TechnicalPersonProfile],
  exports: [TechnicalPersonService],
})
export class GSTechnicalPersonModule {}
