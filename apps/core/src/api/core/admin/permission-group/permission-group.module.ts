import { Module } from '@nestjs/common';
import { PermissionGroupService } from './permission-group.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from 'apps/core/src/database/sequelize/models/core/permission.entity';
import { PermissionGroupController } from './permission-group.controller';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import { PermissionGroup } from 'apps/core/src/database/sequelize/models/core/permissionGroup.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, PermissionGroup])],
  controllers: [PermissionGroupController],
  providers: [PermissionGroupService],
  exports: [PermissionGroupModule],
})
export class PermissionGroupModule {}
