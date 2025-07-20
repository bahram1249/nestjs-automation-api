import { Module } from '@nestjs/common';
import { SingleVendorShoppingCartModule } from '../shopping-cart/shopping-cart.module';
import { SingleVendorPaymentService } from './payment.service';
import { SingleVendorPaymentController } from './payment.controller';
import { SingleVendorPaymentProdviderModule } from '../payment-provider';
import { SessionModule } from '@rahino/ecommerce/user/session/session.module';
import { AddressModule } from '@rahino/ecommerce/user/address/address.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { Setting } from '@rahino/database';
import {
  ECInventoryPrice,
  ECOrder,
  ECOrderDetail,
  ECShoppingCart,
  ECVendorCommission,
} from '@rahino/localdatabase/models';
import { InventoryModule } from '@rahino/ecommerce/shared/inventory/inventory.module';
import { BullModule } from '@nestjs/bullmq';
import { REVERT_PAYMENT_QUEUE } from '../../payment/revert-payment/revert-payment.constants';
import { ConfigService } from '@nestjs/config';
import { REVERT_INVENTORY_QTY_QUEUE } from '@rahino/ecommerce/shared/inventory/constants';

@Module({
  imports: [
    SessionModule,
    SingleVendorShoppingCartModule,
    SingleVendorPaymentProdviderModule,
    AddressModule,
    SequelizeModule,
    LocalizationModule,
    InventoryModule,
    SequelizeModule.forFeature([
      Setting,
      ECOrder,
      ECOrderDetail,
      ECInventoryPrice,
      ECVendorCommission,
      ECShoppingCart,
    ]),

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
  controllers: [SingleVendorPaymentController],
  providers: [SingleVendorPaymentService],
})
export class SingleVendorPaymentModule {}
