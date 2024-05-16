import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECPostageFee } from '@rahino/database/models/ecommerce-eav/ec-postage-fee.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { StockPriceInterface } from '../price';
import { ShipmentInteface } from './interface';
import { OrderShipmentwayEnum } from '@rahino/ecommerce/util/enum';

@Injectable()
export class PostShipmentPriceService implements ShipmentInteface {
  constructor(
    @InjectModel(ECPostageFee)
    private readonly postageFeeRepository: typeof ECPostageFee,
  ) {}

  async cal(
    stockPrices: StockPriceInterface[],
    addressId?: bigint,
  ): Promise<{
    type: OrderShipmentwayEnum;
    price: number;
    realShipmentPrice: number;
  }> {
    const weights = stockPrices.map((stock) => stock.weight);
    const totalWeight = weights.reduce((prev, current) => prev + current, 0);
    let postageFee = await this.postageFeeRepository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(Sequelize.literal(`${totalWeight}`), {
            [Op.between]: [
              Sequelize.col('ECPostageFee.fromWeight'),
              Sequelize.col('ECPostageFee.toWeight'),
            ],
          }),
        )
        .build(),
    );
    if (!postageFee) {
      postageFee = await this.postageFeeRepository.findOne(
        new QueryOptionsBuilder()
          .order({ orderBy: 'id', sortOrder: 'DESC' })
          .build(),
      );
    }

    const calfreeWeight = stockPrices.map((stock) =>
      stock.freeShipment ? 0 : stock.weight,
    );
    const calFreetotalWeight = calfreeWeight.reduce(
      (prev, current) => prev + current,
      0,
    );
    let calFreePostageFee = await this.postageFeeRepository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(Sequelize.literal(`${calFreetotalWeight}`), {
            [Op.between]: [
              Sequelize.col('ECPostageFee.fromWeight'),
              Sequelize.col('ECPostageFee.toWeight'),
            ],
          }),
        )
        .build(),
    );
    if (!calFreePostageFee) {
      calFreePostageFee = await this.postageFeeRepository.findOne(
        new QueryOptionsBuilder()
          .order({ orderBy: 'id', sortOrder: 'DESC' })
          .build(),
      );
    }
    return {
      type: OrderShipmentwayEnum.post,
      price:
        calFreetotalWeight == 0
          ? 0
          : Number(calFreePostageFee.allProvincePrice),
      realShipmentPrice: Number(postageFee.allProvincePrice),
    };
  }
}
