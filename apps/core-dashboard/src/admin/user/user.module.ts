import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { UserService } from './user.service';
import { Role } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, Role])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
