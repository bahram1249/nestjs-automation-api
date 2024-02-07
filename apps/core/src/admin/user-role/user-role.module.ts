import { Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRole } from '@rahino/database/models/core/userRole.entity';
import { Role } from '@rahino/database/models/core/role.entity';

@Module({
  imports: [SequelizeModule.forFeature([UserRole, Role])],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
