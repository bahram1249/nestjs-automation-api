import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '@rahino/database/models/core/role.entity';
import { UserRole } from '@rahino/database/models/core/userRole.entity';
import { RoleUtilService } from './role-util.service';

@Module({
  imports: [SequelizeModule.forFeature([UserRole, Role])],
  providers: [RoleUtilService],
  exports: [RoleUtilService],
})
export class RoleUtilModule {}
