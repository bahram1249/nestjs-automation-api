import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Menu } from '@rahino/database';
import { Permission } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([Permission, User, Menu])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuModule],
})
export class MenuModule {}
