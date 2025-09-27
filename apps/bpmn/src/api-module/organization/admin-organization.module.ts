import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNOrganization } from '@rahino/localdatabase/models';
import { OrganizationApiController } from './organization.controller';
import { OrganizationApiService } from './organization.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BPMNOrganization])],
  controllers: [OrganizationApiController],
  providers: [OrganizationApiService],
})
export class AdminOrganizationApiModule {}
