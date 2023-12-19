import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { AttachmentType } from '@rahino/database/models/core/attachmentType.entity';
import { FileModule } from '@rahino/file';
import { ThumbnailModule } from '@rahino/thumbnail';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { BuffetMenuCategory } from '@rahino/database/models/discount-coffe/buffet-menu-category.entity';
import { BuffetMenuService } from './buffet-menu.service';
import { BuffetMenuController } from './buffet-menu.controller';
import { BuffetMenu } from '@rahino/database/models/discount-coffe/buffet-menu.entity';

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
      BuffetMenu,
      AttachmentType,
      Attachment,
    ]),
  ],
  providers: [BuffetMenuService],
  controllers: [BuffetMenuController],
})
export class BuffetMenuApiModule {}
