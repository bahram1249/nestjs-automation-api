import { Module } from '@nestjs/common';
import { ThumbnailService } from './thumbnail.service';

@Module({
  providers: [ThumbnailService],
  exports: [ThumbnailService],
})
export class ThumbnailModule {}
