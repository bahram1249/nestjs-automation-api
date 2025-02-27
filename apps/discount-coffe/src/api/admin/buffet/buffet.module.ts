import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { BuffetService } from './buffet.service';
import { Buffet } from '@rahino/localdatabase/models';
import { BuffetController } from './buffet.controller';
import { AttachmentType } from '@rahino/database';
import { FileModule } from '@rahino/file';
import { ThumbnailModule } from '@rahino/thumbnail';
import { Attachment } from '@rahino/database';
import { Role } from '@rahino/database';
import { UserRole } from '@rahino/database';
import { BuffetOption } from '@rahino/localdatabase/models';
import { BuffetGallery } from '@rahino/localdatabase/models';

@Module({
  imports: [
    FileModule,
    ThumbnailModule.register({
      width: 990,
      height: 540,
      resizeOptions: {
        withoutEnlargement: true,
        fit: 'inside',
        withoutReduction: true,
      },
    }),
    SequelizeModule.forFeature([
      User,
      Permission,
      Buffet,
      AttachmentType,
      Attachment,
      Role,
      UserRole,
      BuffetOption,
      BuffetGallery,
    ]),
  ],
  providers: [BuffetService],
  controllers: [BuffetController],
})
export class BuffetModule {}
