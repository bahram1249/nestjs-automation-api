import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentServiceProviderModule } from './provider/payment-provider.module';
import { ShipmentModule } from '../stock/services/shipment-price';
import { StockModule } from '../stock/stock.module';
import { AddressModule } from '../../address/address.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProvince } from '@rahino/localdatabase/models';
import { ECVariationPrice } from '@rahino/localdatabase/models';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { ECOrder } from '@rahino/localdatabase/models';
import { ECOrderDetail } from '@rahino/localdatabase/models';
import { ECStock } from '@rahino/localdatabase/models';
import { SessionModule } from '../../session/session.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import {
  DECREASE_INVENTORY_QUEUE,
  REVERT_INVENTORY_QTY_QUEUE,
} from '@rahino/ecommerce/shared/inventory/constants';
import { InventoryModule } from '@rahino/ecommerce/shared/inventory/inventory.module';
import { ECDiscount } from '@rahino/localdatabase/models';
import { ProductModule } from '@rahino/ecommerce/client/product/product.module';
import { ECInventoryPrice } from '@rahino/localdatabase/models';
import { ECVendorCommission } from '@rahino/localdatabase/models';
import { REVERT_PAYMENT_QUEUE } from './revert-payment/revert-payment.constants';
import { RevertPaymentProcessor } from './revert-payment/revert-payment.processor';
import { ECPayment } from '@rahino/localdatabase/models';
import { DBLoggerModule } from '@rahino/logger';
import { PaymentRuleModule } from '../payment-rule/payment-rule.module';
import { ApplyDiscountModule } from '@rahino/ecommerce/shared/apply-discount';

@Module({
  imports: [
    PaymentRuleModule,
    SessionModule,
    SequelizeModule.forFeature([
      ECProvince,
      ECVariationPrice,
      ECPaymentGateway,
      ECPayment,
      ECOrder,
      ECOrderDetail,
      ECStock,
      ECDiscount,
      ECInventoryPrice,
      ECVendorCommission,
    ]),
    PaymentServiceProviderModule,
    SequelizeModule,
    ShipmentModule.register({ token: 'SHIPMENT_SERVICE' }),
    StockModule,
    AddressModule,
    InventoryModule,
    ProductModule,
    ApplyDiscountModule,
    DBLoggerModule,
    BullModule.registerQueueAsync({
      name: DECREASE_INVENTORY_QUEUE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueueAsync({
      name: REVERT_INVENTORY_QTY_QUEUE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    BullModule.registerQueueAsync({
      name: REVERT_PAYMENT_QUEUE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, RevertPaymentProcessor],
})
export class PaymentModule {}
