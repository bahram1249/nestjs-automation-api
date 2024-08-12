import { Module } from '@nestjs/common';
import { GoldonGalleryCalPriceService } from './services';

@Module({
  providers: [GoldonGalleryCalPriceService],
  exports: [GoldonGalleryCalPriceService],
})
export class GoldonGalleryCalPriceModule {}
