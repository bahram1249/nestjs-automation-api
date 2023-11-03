import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import { Permission } from 'apps/core/src/database/sequelize/models/core/permission.entity';
//import { UserProfile } from './mapper/user-profile.mapper';
import { Role } from 'apps/core/src/database/sequelize/models/core/role.entity';
import { UserRole } from 'apps/core/src/database/sequelize/models/core/userRole.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, Role, UserRole])],
  controllers: [UserController],
  providers: [
    //UserProfile,
    UserService,
  ],
  exports: [UserModule, UserService],
})
export class UserModule {}
