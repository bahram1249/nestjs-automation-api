import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Attachment } from 'apps/core/src/database/sequelize/models/core/attachment.entity';
import { AttachmentType } from 'apps/core/src/database/sequelize/models/core/attachmentType.entity';

@Module({
  imports: [SequelizeModule.forFeature([Attachment, AttachmentType])],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
