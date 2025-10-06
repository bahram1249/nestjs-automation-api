import { Injectable } from '@nestjs/common';
import {
  OrderShipmentwayEnum,
  ScheduleSendingTypeEnum,
} from '@rahino/ecommerce/shared/enum';
import { DeliveryShipmentPriceService } from './delivery-shipment-price.service';
import { PostShipmentPriceService } from './post-shipment-price.service';
import {
  ShipmentPriceResult,
  ShipmentSelectionGroupInput,
  ShipmentSelectionGroupResult,
  SelectionsShipmentPriceResult,
  ShipmentStockInput,
} from './dto/shipment-price.dto';
import { LocalizationService } from 'apps/main/src/common/localization';
import { InjectModel } from '@nestjs/sequelize';
import { ECLogisticSendingPeriod } from '@rahino/localdatabase/models';
import { ExpressDeliveryShipmentPriceService } from './express-delivery-shipment-price.service';

@Injectable()
export class ClientShipmentPriceService {
  constructor(
    private readonly deliveryService: DeliveryShipmentPriceService,
    private readonly expressDeliveryService: ExpressDeliveryShipmentPriceService,
    private readonly postService: PostShipmentPriceService,
    private readonly localizationService: LocalizationService,
    @InjectModel(ECLogisticSendingPeriod)
    private readonly sendingPeriodRepo: typeof ECLogisticSendingPeriod,
  ) {}

  async cal(
    stocks: ShipmentStockInput[],
    addressId: bigint | undefined,
    forcedType: OrderShipmentwayEnum,
  ): Promise<ShipmentPriceResult> {
    // Delegate to calSelections to keep a single pricing path
    const groups: ShipmentSelectionGroupInput[] = [
      {
        logisticId: 0 as any, // not needed for single calculation
        shipmentWayId: 0 as any, // not needed for single calculation
        shipmentWayType: forcedType,
        sendingPeriodId: null,
        weeklyPeriodId: null,
        weeklyPeriodTimeId: null,
        stocks,
      },
    ];

    const r = await this.calSelections(groups, addressId);

    // Derive a reasonable typeName via localization (keeps previous API contract)
    let typeNameKey: any = 'ecommerce.shipment.unknown';
    if (forcedType === OrderShipmentwayEnum.delivery)
      typeNameKey = 'ecommerce.shipment.delivery';
    else if (forcedType === OrderShipmentwayEnum.post)
      typeNameKey = 'ecommerce.shipment.post';

    return {
      type: forcedType,
      typeName: this.localizationService.translate(
        typeNameKey,
      ) as unknown as string,
      price: Number(r.totalPrice || 0),
      realShipmentPrice: Number(r.totalRealShipmentPrice || 0),
    };
  }

  // New: Calculate shipping for FE-provided grouped selections (exactly as UI shows)
  async calSelections(
    groups: ShipmentSelectionGroupInput[],
    addressId?: bigint,
  ): Promise<SelectionsShipmentPriceResult> {
    const results: ShipmentSelectionGroupResult[] = [];

    for (const g of groups) {
      let price = 0;
      let realShipmentPrice = 0;

      // Determine schedule sending type (default to normal if not provided or not found)
      let scheduleType: ScheduleSendingTypeEnum =
        ScheduleSendingTypeEnum.normalSending;
      if (g.sendingPeriodId) {
        const period = await this.sendingPeriodRepo.findOne({
          where: { id: g.sendingPeriodId },
        });
        if (period?.scheduleSendingTypeId) {
          scheduleType = Number(
            period.scheduleSendingTypeId,
          ) as ScheduleSendingTypeEnum;
        }
      }

      switch (g.shipmentWayType) {
        case OrderShipmentwayEnum.delivery: {
          // For now both normal/express use the same delivery service; branching retained for future customization
          switch (scheduleType) {
            case ScheduleSendingTypeEnum.expressSending:
              //const r = await this.expressDeliveryService.cal(g.stocks, addressId);
              price = 0; //Number(r.price || 0);
              realShipmentPrice = 0; //Number(r.realShipmentPrice || 0);
              break;
            case ScheduleSendingTypeEnum.normalSending:
            default: {
              const r = await this.deliveryService.cal(g.stocks, addressId);
              price = Number(r.price || 0);
              realShipmentPrice = Number(r.realShipmentPrice || 0);
              break;
            }
          }
          break;
        }
        case OrderShipmentwayEnum.post: {
          // For now both normal/express use the same post service; branching retained for future customization
          switch (scheduleType) {
            case ScheduleSendingTypeEnum.expressSending:
            case ScheduleSendingTypeEnum.normalSending:
            default: {
              const r = await this.postService.cal(g.stocks);
              price = Number(r.price || 0);
              realShipmentPrice = Number(r.realShipmentPrice || 0);
              break;
            }
          }
          break;
        }
        default: {
          // pickup or unknown -> assume 0 cost
          price = 0;
          realShipmentPrice = 0;
        }
      }

      results.push({
        logisticId: g.logisticId,
        shipmentWayId: g.shipmentWayId,
        shipmentWayType: g.shipmentWayType,
        sendingPeriodId: g.sendingPeriodId ?? null,
        weeklyPeriodId: g.weeklyPeriodId ?? null,
        weeklyPeriodTimeId: g.weeklyPeriodTimeId ?? null,
        price,
        realShipmentPrice,
      });
    }

    const totalPrice = results.reduce((s, r) => s + Number(r.price || 0), 0);
    const totalRealShipmentPrice = results.reduce(
      (s, r) => s + Number(r.realShipmentPrice || 0),
      0,
    );

    return {
      groups: results,
      totalPrice,
      totalRealShipmentPrice,
    };
  }
}
