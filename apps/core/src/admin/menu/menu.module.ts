import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Menu } from '@rahino/database/models/core/menu.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';

@Module({
  imports: [SequelizeModule.forFeature([Permission, User, Menu])],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuModule],
})
export class MenuModule {}
