import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { BuffetMenuController } from './buffet-menu.controller';
import { BuffetMenuService } from './buffet-menu.service';
import { BuffetMenu } from '@rahino/localdatabase/models';
import { BuffetMenuCategory } from '@rahino/localdatabase/models';
import { Buffet } from '@rahino/localdatabase/models';

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
