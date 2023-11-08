import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from 'apps/core/src/database/sequelize/models/core/role.entity';
import { RolePermission } from 'apps/core/src/database/sequelize/models/core/rolePermission.entity';

@Module({
  imports: [SequelizeModule.forFeature([Role, RolePermission])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleModule, RoleService],
})
export class RoleModule {}
