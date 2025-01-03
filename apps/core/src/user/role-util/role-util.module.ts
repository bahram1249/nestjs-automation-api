import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from '@rahino/database';
import { UserRole } from '@rahino/database';
import { RoleUtilService } from './role-util.service';

@Module({
  imports: [SequelizeModule.forFeature([UserRole, Role])],
  providers: [RoleUtilService],
  exports: [RoleUtilService],
})
export class RoleUtilModule {}
