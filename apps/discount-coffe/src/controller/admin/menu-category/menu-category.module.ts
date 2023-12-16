import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { BuffetMenuCategory } from '@rahino/database/models/discount-coffe/buffet-menu-category.entity';
import { MenuCategoryController } from './menu-category.controller';
import { MenuCategoryService } from './menu-category.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BuffetMenuCategory])],
  controllers: [MenuCategoryController],
  providers: [MenuCategoryService],
})
export class MenuCategoryModule {}
