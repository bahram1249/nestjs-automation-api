import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize as Seq } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import {
  ECPostageFee,
  ECDiscount,
  ECDiscountType,
} from '@rahino/localdatabase/models';
import { OrderShipmentwayEnum } from '@rahino/ecommerce/shared/enum';
import {
  ShipmentPriceResult,
  ShipmentStockInput,
} from './dto/shipment-price.dto';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class PostShipmentPriceService {
  constructor(
    @InjectModel(ECPostageFee)
    private readonly postageFeeRepository: typeof ECPostageFee,
    @InjectModel(ECDiscount)
    private readonly discountRepository: typeof ECDiscount,
    private readonly localizationService: LocalizationService,
  ) {}

  async cal(stocks: ShipmentStockInput[]): Promise<ShipmentPriceResult> {
    const weights = stocks.map(
      (s) => Number(s.weight || 0) * Number(s.qty || 0),
    );
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    let postageFee = await this.postageFeeRepository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Seq.where(Seq.literal(`${totalWeight}`), {
            [Op.between]: [
              Seq.col('ECPostageFee.fromWeight'),
              Seq.col('ECPostageFee.toWeight'),
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

    const effectiveWeights = stocks.map((s) =>
      s.freeShipment ? 0 : Number(s.weight || 0) * Number(s.qty || 0),
    );
    const calFreetotalWeight = effectiveWeights.reduce((a, b) => a + b, 0);

    let calFreePostageFee = await this.postageFeeRepository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Seq.where(Seq.literal(`${calFreetotalWeight}`), {
            [Op.between]: [
              Seq.col('ECPostageFee.fromWeight'),
              Seq.col('ECPostageFee.toWeight'),
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

    const totalStockPrice = stocks.reduce(
      (sum, s) => sum + Number(s.totalPrice || 0),
      0,
    );
    let freeByDiscount = false;
    if (totalStockPrice > 0) {
      const discount = await this.discountRepository.findOne(
        new QueryOptionsBuilder()
          .filter(
            Seq.where(Seq.fn('isnull', Seq.col('ECDiscount.isDeleted'), 0), {
              [Op.eq]: 0,
            }),
          )
          .filter(
            Seq.where(Seq.fn('isnull', Seq.col('ECDiscount.isActive'), 0), {
              [Op.eq]: 1,
            }),
          )
          .filter(
            Seq.where(
              Seq.fn('isnull', Seq.col('discountType.isFactorBased'), 0),
              {
                [Op.eq]: 1,
              },
            ),
          )
          .filter(
            Seq.where(Seq.literal(`${totalStockPrice}`), {
              [Op.between]: [
                Seq.col('ECDiscount.minPrice'),
                Seq.col('ECDiscount.maxPrice'),
              ],
            }),
          )
          .include([
            { model: ECDiscountType, as: 'discountType', required: true },
          ])
          .build(),
      );
      freeByDiscount = !!discount;
    }

    const realShipmentPrice = Number(postageFee?.allProvincePrice || 0);
    const applyPrice =
      calFreetotalWeight == 0
        ? 0
        : freeByDiscount
          ? 0
          : Number(calFreePostageFee?.allProvincePrice || 0);

    return {
      type: OrderShipmentwayEnum.post,
      typeName: this.localizationService.translate(
        'ecommerce.shipment.post' as any,
      ) as unknown as string,
      price: applyPrice,
      realShipmentPrice,
    };
  }
}
