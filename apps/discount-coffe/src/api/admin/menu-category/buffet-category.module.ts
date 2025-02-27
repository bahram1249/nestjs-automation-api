import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { AttachmentType } from '@rahino/database';
import { FileModule } from '@rahino/file';
import { ThumbnailModule } from '@rahino/thumbnail';
import { Attachment } from '@rahino/database';
import { MenuCategoryService } from './menu-category.service';
import { MenuCategoryController } from './menu-category.controller';
import { BuffetMenuCategory } from '@rahino/localdatabase/models';

@Module({
  imports: [
    FileModule,
    ThumbnailModule.register({
      width: 990,
      height: 540,
      resizeOptions: {
        withoutEnlargement: true,
        withoutReduction: true,
      },
    }),
    SequelizeModule.forFeature([
      User,
      Permission,
      BuffetMenuCategory,
      AttachmentType,
      Attachment,
    ]),
  ],
  providers: [MenuCategoryService],
  controllers: [MenuCategoryController],
})
export class BuffetMenuCategoryApiModule {}
