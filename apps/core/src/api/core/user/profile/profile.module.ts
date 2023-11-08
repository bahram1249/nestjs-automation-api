import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import { Attachment } from 'apps/core/src/database/sequelize/models/core/attachment.entity';
import { AttachmentType } from 'apps/core/src/database/sequelize/models/core/attachmentType.entity';
import { FileModule } from 'apps/core/src/util/core/file/file.module';
import { ThumbnailModule } from 'apps/core/src/util/core/thumbnail/thumbnail.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Attachment, AttachmentType]),
    FileModule,
    ThumbnailModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
