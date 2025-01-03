import { Module } from '@nestjs/common';
import { PermissionGroupService } from './permission-group.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { PermissionGroupController } from './permission-group.controller';
import { User } from '@rahino/database';
import { PermissionGroup } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, PermissionGroup])],
  controllers: [PermissionGroupController],
  providers: [PermissionGroupService],
  exports: [PermissionGroupModule],
})
export class PermissionGroupModule {}
