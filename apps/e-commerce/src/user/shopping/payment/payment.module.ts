import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentServiceProviderModule } from './provider/payment-provider.module';
import { ShipmentModule } from '../stock/services/shipment-price';
import { StockModule } from '../stock/stock.module';
import { AddressModule } from '../../address/address.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProvince } from '@rahino/database';
import { ECVariationPrice } from '@rahino/database';
import { ECPaymentGateway } from '@rahino/database';
import { ECOrder } from '@rahino/database';
import { ECOrderDetail } from '@rahino/database';
import { ECStock } from '@rahino/database';
import { SessionModule } from '../../session/session.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import {
  DECREASE_INVENTORY_QUEUE,
  REVERT_INVENTORY_QTY_QUEUE,
} from '@rahino/ecommerce/inventory/constants';
import { InventoryModule } from '@rahino/ecommerce/inventory/inventory.module';
import { ECDiscount } from '@rahino/database';
import { ProductModule } from '@rahino/ecommerce/product/product.module';
import { ECInventoryPrice } from '@rahino/database';
import { ECVendorCommission } from '@rahino/database';
import { REVERT_PAYMENT_QUEUE } from './revert-payment/revert-payment.constants';
import { RevertPaymentProcessor } from './revert-payment/revert-payment.processor';
import { ECPayment } from '@rahino/database';
import { DBLoggerModule } from '@rahino/logger';
import { PaymentRuleModule } from '../payment-rule/payment-rule.module';

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
