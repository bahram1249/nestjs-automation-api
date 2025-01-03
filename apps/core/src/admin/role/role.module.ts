import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '@rahino/database';
import { RolePermission } from '@rahino/database';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { UserRole } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Role,
      RolePermission,
      Permission,
      UserRole,
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleModule, RoleService],
})
export class RoleModule {}
