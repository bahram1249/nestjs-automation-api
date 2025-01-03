import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
//import { UserProfile } from './mapper/user-profile.mapper';
import { Role } from '@rahino/database';
import { UserRole } from '@rahino/database';

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
