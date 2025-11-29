import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Op, QueryTypes, Sequelize as Seq } from 'sequelize';
import {
  ECAddress,
  ECDiscount,
  ECDiscountType,
} from '@rahino/localdatabase/models';
import { Setting } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { CourierPriceEnum } from '@rahino/ecommerce/admin/order-section/courier-price/enum';
import { OrderShipmentwayEnum } from '@rahino/ecommerce/shared/enum';
import {
  ShipmentPriceResult,
  ShipmentStockInput,
} from './dto/shipment-price.dto';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class DeliveryShipmentPriceService {
  constructor(
    @InjectModel(ECAddress)
    private readonly addressRepository: typeof ECAddress,
    @InjectModel(Setting)
    private readonly settingRepository: typeof Setting,
    @InjectModel(ECDiscount)
    private readonly discountRepository: typeof ECDiscount,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly localizationService: LocalizationService,
  ) {}

  async cal(
    stocks: ShipmentStockInput[],
    addressId?: bigint,
  ): Promise<ShipmentPriceResult> {
    if (!addressId) {
      return {
        type: OrderShipmentwayEnum.delivery,
        typeName: this.localizationService.translate(
          'ecommerce.shipment.delivery' as any,
        ) as unknown as string,
        price: 0,
        realShipmentPrice: 0,
      };
    }

    const address = await this.addressRepository.findOne(
      new QueryOptionsBuilder().filter({ id: addressId }).build(),
    );
    const baseCourierPrice = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: CourierPriceEnum.BASE_COURIER_PRICE })
        .build(),
    );
    const courierPriceByKilometre = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: CourierPriceEnum.COURIER_PRICE_BY_KILOMETRE })
        .build(),
    );

    let km = 0;
    if (address) {
      const result = (await this.sequelize.query(
        `SELECT dbo.fnCalcDistanceKM(:lat, 35.6547943591637, :long, 51.430869822087814) as distance`,
        {
          replacements: { lat: address.latitude, long: address.longitude },
          type: QueryTypes.SELECT,
        },
      )) as Array<{ distance: number } & Record<string, unknown>>;
      km = Math.ceil(Number(result?.[0]?.['distance'] ?? 0));
    }

    const freeShipmentByItems =
      stocks.length > 0 && stocks.every((s) => !!s.freeShipment);
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

    const priceBase =
      Number(baseCourierPrice?.value || 0) +
      km * Number(courierPriceByKilometre?.value || 0);
    const applyPrice = freeShipmentByItems || freeByDiscount ? 0 : priceBase;

    return {
      type: OrderShipmentwayEnum.delivery,
      typeName: this.localizationService.translate(
        'ecommerce.shipment.delivery' as any,
      ) as unknown as string,
      price: applyPrice,
      realShipmentPrice: priceBase,
    };
  }
}
