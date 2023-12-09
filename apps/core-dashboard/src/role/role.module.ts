import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission])],
  controllers: [RoleController],
})
export class RoleModule {}
