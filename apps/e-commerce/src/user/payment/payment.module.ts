import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentServiceProviderModule } from './provider/payment-provider.module';
import { ShipmentModule } from '../stock/services/shipment-price';
import { StockModule } from '../stock/stock.module';
import { AddressModule } from '../address/address.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { ECStock } from '@rahino/database/models/ecommerce-eav/ec-stocks.entity';
import { SessionModule } from '../session/session.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import {
  DECREASE_INVENTORY_QUEUE,
  REVERT_INVENTORY_QTY_QUEUE,
} from '@rahino/ecommerce/inventory/constants';
import { InventoryModule } from '@rahino/ecommerce/inventory/inventory.module';
import { ECDiscount } from '@rahino/database/models/ecommerce-eav/ec-discount.entity';
import { ProductModule } from '@rahino/ecommerce/product/product.module';
import { ECInventoryPrice } from '@rahino/database/models/ecommerce-eav/ec-inventory-price.entity';
import { ECVendorCommission } from '@rahino/database/models/ecommerce-eav/ec-vendor-commision.entity';

@Module({
  imports: [
    SessionModule,
    SequelizeModule.forFeature([
      ECProvince,
      ECVariationPrice,
      ECPaymentGateway,
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
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
