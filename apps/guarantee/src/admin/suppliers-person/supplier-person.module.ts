import { Module } from '@nestjs/common';
import { SupplierPersonService } from './supplier-person.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNOrganizationUser,
  GSSupplierPerson,
} from '@rahino/localdatabase/models';
import { User, Permission, UserRole, Role } from '@rahino/database';
import { SupplierPersonController } from './supplier-person.controller';
import { SupplierPersonProfile } from './mapper';
import { OrganizationStuffModule } from '@rahino/guarantee/shared/organization-stuff';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { BPMNOrganizationUserModule } from '@rahino/bpmn/modules/organization-user/organization-user.module';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([
      GSSupplierPerson,
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
  controllers: [SupplierPersonController],
  providers: [SupplierPersonService, SupplierPersonProfile],
  exports: [SupplierPersonService],
})
export class GSSupplierPersonModule {}
