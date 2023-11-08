import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from 'apps/core/src/database/sequelize/models/core/role.entity';
import { UserRole } from 'apps/core/src/database/sequelize/models/core/userRole.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';

@Module({
  imports: [SequelizeModule.forFeature([UserRole, Role])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleModule],
})
export class RoleModule {}
