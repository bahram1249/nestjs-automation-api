import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { BuffetMenuController } from './buffet-menu.controller';
import { BuffetMenuService } from './buffet-menu.service';
import { BuffetMenu } from '@rahino/database/models/discount-coffe/buffet-menu.entity';
import { BuffetMenuCategory } from '@rahino/database/models/discount-coffe/buffet-menu-category.entity';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';

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
