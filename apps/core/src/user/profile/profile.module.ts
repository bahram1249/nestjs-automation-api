import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { AttachmentType } from '@rahino/database/models/core/attachmentType.entity';
import { FileModule } from '@rahino/file';
import { ThumbnailModule } from '@rahino/thumbnail';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Attachment, AttachmentType]),
    FileModule,
    ThumbnailModule.register({
      width: 700,
      height: 700,
      resizeOptions: { withoutEnlargement: true },
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
