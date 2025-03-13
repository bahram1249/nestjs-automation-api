import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNOrganizationUser } from '@rahino/localdatabase/models';
import { OrganizationUserService } from './organization-user.service';

@Module({
  imports: [SequelizeModule.forFeature([BPMNOrganizationUser])],
  providers: [OrganizationUserService],
  exports: [OrganizationUserService],
})
export class BPMNOrganizationUserModule {}
