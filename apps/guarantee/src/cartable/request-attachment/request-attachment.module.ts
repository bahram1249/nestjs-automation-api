import { Module } from '@nestjs/common';
import { RequestAttachmentService } from './request-attachment.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequestAttachment } from '@rahino/localdatabase/models';
import { RequestAttachmentController } from './request-attachment.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [SequelizeModule, SequelizeModule.forFeature([GSRequestAttachment])],
  controllers: [RequestAttachmentController],
  providers: [RequestAttachmentService],
  exports: [RequestAttachmentService],
})
export class CartableRequestAttachmentModule {}
