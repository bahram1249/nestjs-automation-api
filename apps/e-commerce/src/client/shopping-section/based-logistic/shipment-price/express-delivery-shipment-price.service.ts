import { Injectable } from '@nestjs/common';
import {
  ShipmentPriceResult,
  ShipmentStockInput,
} from './dto/shipment-price.dto';
import { DeliveryShipmentPriceService } from './delivery-shipment-price.service';

@Injectable()
export class ExpressDeliveryShipmentPriceService {
  constructor(
    private readonly deliveryShipmentPriceService: DeliveryShipmentPriceService,
  ) {}

  async cal(
    stocks: ShipmentStockInput[],
    addressId?: bigint,
  ): Promise<ShipmentPriceResult> {
    const result = await this.deliveryShipmentPriceService.cal(
      stocks,
      addressId,
    );
    result.price = result.price * 1.2;
    result.realShipmentPrice = result.realShipmentPrice * 1.2;
    return result;
  }
}
