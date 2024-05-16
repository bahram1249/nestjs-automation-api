import { Injectable } from '@nestjs/common';
import { StockPriceInterface } from '../price';
import { ShipmentInteface } from './interface';
import { PostShipmentPriceService } from './post-shipment-price.service';
import { OrderShipmentwayEnum } from '@rahino/ecommerce/util/enum';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { ECAddress } from '@rahino/database/models/ecommerce-eav/ec-address.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';
import { Setting } from '@rahino/database/models/core/setting.entity';
import { CourierPriceEnum } from '@rahino/ecommerce/admin/courier-price/enum';

@Injectable()
export class JahizanShipmentPrice implements ShipmentInteface {
  constructor(
    @InjectModel(ECAddress)
    private readonly addressRepository: typeof ECAddress,
    private readonly postShipmentService: PostShipmentPriceService,
    @InjectModel(Setting)
    private readonly settingRepository: typeof Setting,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}
  async cal(
    stockPrices: StockPriceInterface[],
    addressId?: bigint,
  ): Promise<{
    type: OrderShipmentwayEnum;
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
          `SELECT dbo.fnCalcDistanceKM(:lat, 35.6547943591637, :long, 51.430869822087814) as distance`,
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

        const price =
          Number(baseCourierPrice.value) +
          km * Number(courierPriceByKilometer.value);
        const applyShipmentPrice = shipmentPrice ? 0 : price;
        return {
          price: applyShipmentPrice,
          type: OrderShipmentwayEnum.delivery,
          realShipmentPrice: price,
        };
      }
    }

    return await this.postShipmentService.cal(stockPrices, addressId);
  }
}
