import { Module } from '@nestjs/common';
import { PermissionGroupService } from './permission-group.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PermissionGroupController } from './permission-group.controller';
import { PermissionGroup } from 'apps/core/src/database/sequelize/models/core/permissionGroup.entity';

@Module({
  imports: [SequelizeModule.forFeature([PermissionGroup])],
  controllers: [PermissionGroupController],
  providers: [PermissionGroupService],
  exports: [PermissionGroupModule],
})
export class PermissionGroupModule {}
