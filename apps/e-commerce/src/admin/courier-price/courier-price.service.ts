import { Injectable } from '@nestjs/common';
import { CourierPriceDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { CourierPriceEnum } from './enum';

@Injectable()
export class CourierPriceService {
  constructor(
    @InjectModel(Setting)
    private readonly repository: typeof Setting,
  ) {}

  async findOne() {
    const baseCourierPrice = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: CourierPriceEnum.BASE_COURIER_PRICE })
        .build(),
    );
    const courierPriceByKilometer = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: CourierPriceEnum.COURIER_PRICE_BY_KILOMETRE })
        .build(),
    );
    return {
      result: {
        baseCourierPrice: baseCourierPrice.value,
        courierPriceByKilometer: courierPriceByKilometer.value,
      },
    };
  }

  async update(dto: CourierPriceDto) {
    let baseCourierPrice = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: CourierPriceEnum.BASE_COURIER_PRICE })
        .build(),
    );
    baseCourierPrice.value = String(dto.baseCourierPrice);
    baseCourierPrice = await baseCourierPrice.save();

    let courierPriceByKilometer = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: CourierPriceEnum.COURIER_PRICE_BY_KILOMETRE })
        .build(),
    );
    courierPriceByKilometer.value = String(dto.courierPriceByKilometre);
    courierPriceByKilometer = await courierPriceByKilometer.save();

    return {
      result: {
        baseCourierPrice: dto.baseCourierPrice,
        courierPriceByKilometer: dto.courierPriceByKilometre,
      },
    };
  }
}
