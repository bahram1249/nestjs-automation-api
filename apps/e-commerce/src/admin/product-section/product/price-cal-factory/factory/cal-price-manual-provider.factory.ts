import { Injectable } from '@nestjs/common';
import {
  GeneralCalPriceService,
  GoldonGalleryCalPriceService,
} from '../services';
import { Setting } from '@rahino/database';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class CalPriceManualProviderFactory {
  constructor(
    private readonly goldonGalleryService: GoldonGalleryCalPriceService,
    private readonly generalCalPriceService: GeneralCalPriceService,
    @InjectModel(Setting)
    private readonly settingRepository: typeof Setting,
  ) {}

  async create() {
    const setting = await this.settingRepository.findOne(
      new QueryOptionsBuilder().filter({ key: 'CUSTOMER_NAME' }).build(),
    );
    const customerName = setting.value;
    switch (customerName) {
      case 'goldongallery':
        return this.goldonGalleryService;
      case 'pegahgallery':
        return this.goldonGalleryService;
      default:
        return this.generalCalPriceService;
    }
  }
}
