import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '@rahino/database/models/core/role.entity';
import { RolePermission } from '@rahino/database/models/core/rolePermission.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role, RolePermission, Permission]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleModule, RoleService],
})
export class RoleModule {}
