import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import { Menu } from 'apps/core/src/database/sequelize/models/core/menu.entity';
import { Permission } from 'apps/core/src/database/sequelize/models/core/permission.entity';

@Module({
  imports: [SequelizeModule.forFeature([Permission, User, Menu])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuModule],
})
export class MenuModule {}
