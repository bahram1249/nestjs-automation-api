import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { AddressModule } from '../../address/address.module';
import { SessionModule } from '../../session/session.module';
import { DBLoggerModule } from '@rahino/logger';
import { ProductModule } from '@rahino/ecommerce/product/product.module';
import { QueryFilterModule } from '@rahino/query-filter';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ECShoppingCart,
  ECShoppingCartProduct,
} from '@rahino/localdatabase/models';
import { InventoryModule } from '@rahino/ecommerce/inventory/inventory.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SHOPPING_CART_PRODUCT_REMOVE_QUEUE } from './constants';

@Module({
  imports: [
    LocalizationModule,
    AddressModule,
    SessionModule,
    DBLoggerModule,
    ProductModule,
    QueryFilterModule,
    SequelizeModule.forFeature([ECShoppingCart, ECShoppingCartProduct]),
    InventoryModule,

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
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
