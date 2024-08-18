import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from '@rahino/database/models/core/setting.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { RetrievePricePersianApiService } from './retrieve-price-persian-api.service';

@Injectable()
export class RetrievePriceRunnerService {
  constructor(
    @InjectModel(Setting)
    private readonly settingRepository: typeof Setting,
    private readonly service: RetrievePricePersianApiService,
  ) {}

  public async run() {
    const setting = await this.settingRepository.findOne(
      new QueryOptionsBuilder().filter({ key: 'CUSTOMER_NAME' }).build(),
    );
    if (setting.value == 'goldongallery') {
      // await this.service.getPriceThenUpdate();
      // set time of job
    }
  }
}
