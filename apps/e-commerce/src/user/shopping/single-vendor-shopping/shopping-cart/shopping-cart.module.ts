import { Module } from '@nestjs/common';
import { SingleVendorShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { AddressModule } from '../../../address/address.module';
import { SessionModule } from '../../../session/session.module';
import { DBLoggerModule } from '@rahino/logger';
import { ProductModule } from '@rahino/ecommerce/client/product/product.module';
import { QueryFilterModule } from '@rahino/query-filter';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ECShoppingCart,
  ECShoppingCartProduct,
  ECVendor,
} from '@rahino/localdatabase/models';
import { InventoryModule } from '@rahino/ecommerce/shared/inventory/inventory.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SHOPPING_CART_PRODUCT_REMOVE_QUEUE } from './constants';
import { ApplyDiscountModule } from '@rahino/ecommerce/shared/apply-discount';
import { Setting } from '@rahino/database';

@Module({
  imports: [
    LocalizationModule,
    AddressModule,
    SessionModule,
    DBLoggerModule,
    ProductModule,
    QueryFilterModule,
    SequelizeModule,
    SequelizeModule.forFeature([
      ECShoppingCart,
      ECShoppingCartProduct,
      ECVendor,
      Setting,
    ]),
    InventoryModule,
    ApplyDiscountModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
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
      name: SHOPPING_CART_PRODUCT_REMOVE_QUEUE,
    }),
  ],
  controllers: [ShoppingCartController],
  providers: [SingleVendorShoppingCartService],
  exports: [SingleVendorShoppingCartService],
})
export class SingleVendorShoppingCartModule {}
