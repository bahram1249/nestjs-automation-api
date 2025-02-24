import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  SYNC_SELLER_BRAND_QUEUE,
  SYNC_SELLER_FLOW_PRODUCER,
  SYNC_SELLER_PRODUCT_TYPE_QUEUE,
  SYNC_SELLER_WARRANTY_QUEUE,
} from './constants';
import {
  SellerBrandProcessor,
  SellerProductTypeProcessor,
  SellerWarrantyProcessor,
} from './processor';
import { SellerSyncService } from './seller-sync.service';
import { SellerSyncController } from './seller-sync.controller';
import { SellerBrandModule } from '@rahino/guarantee/util/seller-brand';
import { SellerProductTypeModule } from '@rahino/guarantee/util/seller-product-type';
import { SellerWarrantyModule } from '@rahino/guarantee/util/seller-warranty';

@Module({
  imports: [
    SellerBrandModule,
    SellerProductTypeModule,
    SellerWarrantyModule,
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
    BullModule.registerFlowProducerAsync({
      name: SYNC_SELLER_FLOW_PRODUCER,
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
  controllers: [SellerSyncController],
  providers: [
    SellerSyncService,
    SellerBrandProcessor,
    SellerProductTypeProcessor,
    SellerWarrantyProcessor,
  ],
  exports: [SellerSyncService],
})
export class SellerSyncModule {}
