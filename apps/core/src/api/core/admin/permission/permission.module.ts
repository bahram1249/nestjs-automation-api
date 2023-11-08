import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from 'apps/core/src/database/sequelize/models/core/permission.entity';
import { PermissionController } from './permission.controller';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import { RolePermission } from 'apps/core/src/database/sequelize/models/core/rolePermission.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, RolePermission])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionModule],
})
export class PermissionModule {}
