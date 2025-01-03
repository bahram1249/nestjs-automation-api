import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { PermissionController } from './permission.controller';
import { User } from '@rahino/database';
import { RolePermission } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, RolePermission])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionModule],
})
export class PermissionModule {}
