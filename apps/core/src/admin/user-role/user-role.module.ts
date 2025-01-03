import { Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserRole } from '@rahino/database';
import { Role } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([UserRole, Role])],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
