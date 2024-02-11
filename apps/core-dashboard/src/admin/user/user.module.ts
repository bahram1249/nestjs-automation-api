import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { UserService } from './user.service';
import { Role } from '@rahino/database/models/core/role.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, Role])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
