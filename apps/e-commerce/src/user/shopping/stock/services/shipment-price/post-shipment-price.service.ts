import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECPostageFee } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { StockPriceInterface } from '../price';
import { ShipmentInteface } from './interface';
import { OrderShipmentwayEnum } from '@rahino/ecommerce/shared/enum';
import { ECDiscount } from '@rahino/localdatabase/models';
import { ECDiscountType } from '@rahino/localdatabase/models';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class PostShipmentPriceService implements ShipmentInteface {
  constructor(
    @InjectModel(ECPostageFee)
    private readonly postageFeeRepository: typeof ECPostageFee,
    @InjectModel(ECDiscount)
    private readonly discountRepository: typeof ECDiscount,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async cal(
    stockPrices: StockPriceInterface[],
    addressId?: bigint,
  ): Promise<{
    type: OrderShipmentwayEnum;
    typeName: string;
    price: number;
    realShipmentPrice: number;
  }> {
    const weights = stockPrices.map((stock) => stock.weight * stock.qty);
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
      stock.freeShipment ? 0 : stock.weight * stock.qty,
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

    let freeShipment = false;
    const totalStockPrice = stockPrices
      .map((stock) => stock.totalPrice)
      .reduce((prev, current) => prev + current, 0);

    const discount = await this.discountRepository.findOne(
      new QueryOptionsBuilder()
        .filter(
          this.seqHelp.whereIsNullColumnEqualToZero('ECDiscount.isDeleted', 0),
        )
        .filter(
          this.seqHelp.whereIsNullColumnEqualToValue(
            'ECDiscount.isActive',
            0,
            1,
          ),
        )
        .filter(
          this.seqHelp.whereIsNullColumnEqualToValue(
            'discountType.isFactorBased',
            0,
            1,
          ),
        )
        .filter(
          Sequelize.where(Sequelize.literal(`${totalStockPrice}`), {
            [Op.between]: [
              Sequelize.col('ECDiscount.minPrice'),
              Sequelize.col('ECDiscount.maxPrice'),
            ],
          }),
        )
        .include([
          {
            model: ECDiscountType,
            as: 'discountType',
            required: true,
          },
        ])

        .build(),
    );
    if (discount) {
      freeShipment = true;
    }

    return {
      type: OrderShipmentwayEnum.post,
      typeName: 'از طریق پست',
      price:
        calFreetotalWeight == 0
          ? 0
          : freeShipment
            ? 0
            : Number(calFreePostageFee.allProvincePrice),
      realShipmentPrice: Number(postageFee.allProvincePrice),
    };
  }
}
