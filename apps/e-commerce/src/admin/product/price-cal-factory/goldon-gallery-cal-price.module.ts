import { Module } from '@nestjs/common';
import { GoldonGalleryCalPriceService } from './services';
import { SequelizeModule } from '@nestjs/sequelize';
import { Setting } from '@rahino/database/models/core/setting.entity';

@Module({
  imports: [SequelizeModule.forFeature([Setting])],
  providers: [GoldonGalleryCalPriceService],
  exports: [GoldonGalleryCalPriceService],
})
export class GoldonGalleryCalPriceModule {}
