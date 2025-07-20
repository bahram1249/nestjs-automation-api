import { Injectable } from '@nestjs/common';
import { StockPriceInterface } from '../price';
import { ShipmentInteface } from './interface';
import { OrderShipmentwayEnum } from '@rahino/ecommerce/shared/enum';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { ECAddress } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize-typescript';
import { Op, QueryTypes } from 'sequelize';
import { Setting } from '@rahino/database';
import { CourierPriceEnum } from '@rahino/ecommerce/admin/order-section/courier-price/enum';
import { ECDiscount } from '@rahino/localdatabase/models';
import { ECDiscountType } from '@rahino/localdatabase/models';
import { TipaxShipmentPrice } from './tipax.service';

@Injectable()
export class GoldonShipmentPrice implements ShipmentInteface {
  constructor(
    @InjectModel(ECAddress)
    private readonly addressRepository: typeof ECAddress,
    private readonly tipaxShipmentPrice: TipaxShipmentPrice,
    @InjectModel(Setting)
    private readonly settingRepository: typeof Setting,
    @InjectModel(ECDiscount)
    private readonly discountRepository: typeof ECDiscount,
    @InjectConnection()
    private readonly sequelize: Sequelize,
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
    if (addressId) {
      const address = await this.addressRepository.findOne(
        new QueryOptionsBuilder().filter({ id: addressId }).build(),
      );
      if (address.cityId == 215) {
        const baseCourierPrice = await this.settingRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ key: CourierPriceEnum.BASE_COURIER_PRICE })
            .build(),
        );
        const courierPriceByKilometer = await this.settingRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ key: CourierPriceEnum.COURIER_PRICE_BY_KILOMETRE })
            .build(),
        );

        const result = await this.sequelize.query(
          `SELECT dbo.fnCalcDistanceKM(:lat, 35.73849052186516, :long, 51.31360452111076) as distance`,
          {
            replacements: {
              lat: address.latitude,
              long: address.longitude,
            },
            type: QueryTypes.SELECT,
          },
        );
        const km = Math.ceil(Number(result[0]['distance']));

        const freeShipmnetCount = stockPrices.filter(
          (stockPrice) => stockPrice.freeShipment == true,
        ).length;
        let shipmentPrice: boolean = null;
        if (freeShipmnetCount == stockPrices.length) {
          shipmentPrice = true;
        }

        const totalStockPrice = stockPrices
          .map((stock) => stock.totalPrice)
          .reduce((prev, current) => prev + current, 0);

        const discount = await this.discountRepository.findOne(
          new QueryOptionsBuilder()
            .filter(
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('ECDiscount.isDeleted'),
                  0,
                ),
                {
                  [Op.eq]: 0,
                },
              ),
            )
            .filter(
              Sequelize.where(
                Sequelize.fn('isnull', Sequelize.col('ECDiscount.isActive'), 0),
                {
                  [Op.eq]: 1,
                },
              ),
            )
            .filter(
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('discountType.isFactorBased'),
                  0,
                ),
                {
                  [Op.eq]: 1,
                },
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
          shipmentPrice = true;
        }

        const price =
          Number(baseCourierPrice.value) +
          km * Number(courierPriceByKilometer.value);
        const applyShipmentPrice = shipmentPrice ? 0 : price;
        return {
          price: applyShipmentPrice,
          typeName: 'از طریق پیک',
          type: OrderShipmentwayEnum.delivery,
          realShipmentPrice: price,
        };
      }
    }

    return await this.tipaxShipmentPrice.cal(stockPrices, addressId);
  }
}
