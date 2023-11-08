import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
//import { UserProfile } from './mapper/user-profile.mapper';
import { Role } from 'apps/core/src/database/sequelize/models/core/role.entity';
import { UserRole } from 'apps/core/src/database/sequelize/models/core/userRole.entity';

@Module({
  imports: [SequelizeModule.forFeature([Role, UserRole])],
  controllers: [UserController],
  providers: [
    //UserProfile,
    UserService,
  ],
  exports: [UserModule, UserService],
})
export class UserModule {}
