import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from 'apps/core/src/database/sequelize/models/core/role.entity';
import { RolePermission } from 'apps/core/src/database/sequelize/models/core/rolePermission.entity';
import { Permission } from 'apps/core/src/database/sequelize/models/core/permission.entity';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, RolePermission, Permission]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleModule, RoleService],
})
export class RoleModule {}
