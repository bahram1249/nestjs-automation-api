import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PermissionController } from './permission.controller';
import { RolePermission } from 'apps/core/src/database/sequelize/models/core/rolePermission.entity';

@Module({
  imports: [SequelizeModule.forFeature([RolePermission])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionModule],
})
export class PermissionModule {}
