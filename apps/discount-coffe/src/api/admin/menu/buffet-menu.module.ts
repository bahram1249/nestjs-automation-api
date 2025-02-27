import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { AttachmentType } from '@rahino/database';
import { FileModule } from '@rahino/file';
import { ThumbnailModule } from '@rahino/thumbnail';
import { Attachment } from '@rahino/database';
import { BuffetMenuCategory } from '@rahino/localdatabase/models';
import { BuffetMenuService } from './buffet-menu.service';
import { BuffetMenuController } from './buffet-menu.controller';
import { BuffetMenu } from '@rahino/localdatabase/models';

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
