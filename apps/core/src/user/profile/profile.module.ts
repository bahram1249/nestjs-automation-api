import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Attachment } from '@rahino/database';
import { AttachmentType } from '@rahino/database';
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
