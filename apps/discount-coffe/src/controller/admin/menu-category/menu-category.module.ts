import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { BuffetMenuCategory } from '@rahino/localdatabase/models';
import { MenuCategoryController } from './menu-category.controller';
import { MenuCategoryService } from './menu-category.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BuffetMenuCategory])],
  controllers: [MenuCategoryController],
  providers: [MenuCategoryService],
})
export class MenuCategoryModule {}
