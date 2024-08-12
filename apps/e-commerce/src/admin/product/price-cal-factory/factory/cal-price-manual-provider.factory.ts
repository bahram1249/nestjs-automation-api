import { Injectable } from '@nestjs/common';
import {
  GeneralCalPriceService,
  GoldonGalleryCalPriceService,
} from '../services';

@Injectable()
export class CalPriceManualProviderFactory {
  constructor(
    private readonly goldonGalleryService: GoldonGalleryCalPriceService,
    private readonly generalCalPriceService: GeneralCalPriceService,
  ) {}

  async create(customerName: string) {
    switch (customerName) {
      case 'goldongallery':
        return this.goldonGalleryService;
      default:
        return this.generalCalPriceService;
    }
  }
}
