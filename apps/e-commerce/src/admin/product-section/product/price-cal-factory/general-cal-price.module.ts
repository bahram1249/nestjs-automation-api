import { Module } from '@nestjs/common';
import { GeneralCalPriceService } from './services';

@Module({
  providers: [GeneralCalPriceService],
  exports: [GeneralCalPriceService],
})
export class GeneralCalPriceModule {}
