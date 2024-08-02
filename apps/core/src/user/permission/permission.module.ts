import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { RolePermission } from '@rahino/database/models/core/rolePermission.entity';
import { UserRole } from '@rahino/database/models/core/userRole.entity';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';

@Module({
  imports: [SequelizeModule.forFeature([UserRole, Permission, RolePermission])],
  providers: [PermissionService],
  controllers: [PermissionController],
})
export class PermissionModule {}
