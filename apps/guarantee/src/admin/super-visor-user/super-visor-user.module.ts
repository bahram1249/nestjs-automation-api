import { Module } from '@nestjs/common';
import { SuperVisorUserService } from './super-visor-user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNOrganizationUser,
  GSSuperVisorUser,
  GSTechnicalPerson,
} from '@rahino/localdatabase/models';
import { User, Permission, UserRole, Role } from '@rahino/database';
import { SuperVisorController } from './super-visor-user.controller';
import { SuperVisorUserProfile } from './mapper';
import { OrganizationStuffModule } from '@rahino/guarantee/shared/organization-stuff';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([
      GSSuperVisorUser,
      User,
      Permission,
      UserRole,
      Role,
    ]),
    LocalizationModule,
    OrganizationStuffModule,
  ],
  controllers: [SuperVisorController],
  providers: [SuperVisorUserService, SuperVisorUserProfile],
  exports: [SuperVisorUserService],
})
export class GSSuperVisorUserModule {}
