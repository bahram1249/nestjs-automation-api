import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { Role } from '@rahino/database';
import { User } from '@rahino/database';
import { UserRole } from '@rahino/database';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, UserRole, Role])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
