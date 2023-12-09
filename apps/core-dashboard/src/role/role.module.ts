import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { RoleService } from './role.service';
import { Role } from '@rahino/database/models/core/role.entity';
import { PermissionGroup } from '@rahino/database/models/core/permissionGroup.entity';
import { RolePermission } from '@rahino/database/models/core/rolePermission.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      Role,
      PermissionGroup,
      RolePermission,
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
