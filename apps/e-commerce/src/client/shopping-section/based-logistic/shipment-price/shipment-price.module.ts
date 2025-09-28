import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClientShipmentPriceService } from './shipment-price.service';
import {
  ECPostageFee,
  ECAddress,
  ECDiscount,
  ECDiscountType,
} from '@rahino/localdatabase/models';
import { Setting } from '@rahino/database';
import { DeliveryShipmentPriceService } from './delivery-shipment-price.service';
import { PostShipmentPriceService } from './post-shipment-price.service';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { ClientShipmentPriceController } from './shipment-price.controller';
import { ClientValidateAddressModule } from '@rahino/ecommerce/client/shopping-section/based-logistic/validate-address/client-validate-address.module';
import { SessionModule } from '@rahino/ecommerce/user/session/session.module';
import { ECLogisticSendingPeriod } from '@rahino/localdatabase/models';
import { ExpressDeliveryShipmentPriceService } from './express-delivery-shipment-price.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ECPostageFee,
      ECAddress,
      Setting,
      ECDiscount,
      ECDiscountType,
      ECLogisticSendingPeriod,
    ]),
    LocalizationModule,
    SessionModule,
  ],
  controllers: [ClientShipmentPriceController],
  providers: [
    DeliveryShipmentPriceService,
    PostShipmentPriceService,
    ExpressDeliveryShipmentPriceService,
    ClientShipmentPriceService,
  ],
  exports: [
    DeliveryShipmentPriceService,
    PostShipmentPriceService,
    ClientShipmentPriceService,
  ],
})
export class ClientShipmentPriceModule {}
