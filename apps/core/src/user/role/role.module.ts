import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { Role } from '@rahino/database/models/core/role.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { UserRole } from '@rahino/database/models/core/userRole.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, UserRole, Role])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleModule],
})
export class RoleModule {}
