import { Injectable } from '@nestjs/common';
import { OrderShipmentwayEnum } from '@rahino/ecommerce/shared/enum';
import { DeliveryShipmentPriceService } from './delivery-shipment-price.service';
import { PostShipmentPriceService } from './post-shipment-price.service';
import { ShipmentPriceResult, ShipmentStockInput } from './dto/shipment-price.dto';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class ClientShipmentPriceService {
  constructor(
    private readonly deliveryService: DeliveryShipmentPriceService,
    private readonly postService: PostShipmentPriceService,
    private readonly localizationService: LocalizationService,
  ) {}

  async cal(
    stocks: ShipmentStockInput[],
    addressId: bigint | undefined,
    forcedType: OrderShipmentwayEnum,
  ): Promise<ShipmentPriceResult> {
    switch (forcedType) {
      case OrderShipmentwayEnum.delivery:
        return this.deliveryService.cal(stocks, addressId);
      case OrderShipmentwayEnum.post:
        return this.postService.cal(stocks);
      default:
        return {
          type: forcedType,
          typeName: this.localizationService.translate('ecommerce.shipment.unknown' as any) as unknown as string,
          price: 0,
          realShipmentPrice: 0,
        };
    }
  }
}
