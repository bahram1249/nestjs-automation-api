import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { RoleService } from './role.service';
import { Role } from '@rahino/database';
import { PermissionGroup } from '@rahino/database';
import { RolePermission } from '@rahino/database';

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
