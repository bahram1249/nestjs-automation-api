import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { BuffetService } from './buffet.service';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { BuffetController } from './buffet.controller';
import { AttachmentType } from '@rahino/database/models/core/attachmentType.entity';
import { FileModule } from '@rahino/file';
import { ThumbnailModule } from '@rahino/thumbnail';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { Role } from '@rahino/database/models/core/role.entity';
import { UserRole } from '@rahino/database/models/core/userRole.entity';
import { BuffetOption } from '@rahino/database/models/discount-coffe/buffet-option.entity';
import { BuffetGallery } from '@rahino/database/models/discount-coffe/buffet-gallery.entity';

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
