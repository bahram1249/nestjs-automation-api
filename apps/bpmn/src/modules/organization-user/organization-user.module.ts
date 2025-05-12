import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNOrganizationUser } from '@rahino/localdatabase/models';
import { OrganizationUserService } from './organization-user.service';
import { Role, UserRole } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([BPMNOrganizationUser, Role, UserRole])],
  providers: [OrganizationUserService],
  exports: [OrganizationUserService],
})
export class BPMNOrganizationUserModule {}
