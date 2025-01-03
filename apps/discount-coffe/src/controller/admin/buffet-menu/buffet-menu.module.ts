import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { BuffetMenuController } from './buffet-menu.controller';
import { BuffetMenuService } from './buffet-menu.service';
import { BuffetMenu } from '@rahino/database';
import { BuffetMenuCategory } from '@rahino/database';
import { Buffet } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      BuffetMenu,
      BuffetMenuCategory,
      Buffet,
    ]),
  ],
  controllers: [BuffetMenuController],
  providers: [BuffetMenuService],
})
export class BuffetMenuModule {}
