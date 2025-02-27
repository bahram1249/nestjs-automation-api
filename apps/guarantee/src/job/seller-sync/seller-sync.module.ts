import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SYNC_SELLER_FLOW_PRODUCER } from './constants';
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
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSBrand,
  GSGuarantee,
  GSGuaranteePeriod,
  GSProductType,
  GSVariant,
} from '@rahino/localdatabase/models';
import { Setting } from '@rahino/database';
import { SellerVaraintModule } from '@rahino/guarantee/util/seller-variant';
import { SellerVariantProcessor } from './processor/sync-seller-variant.processor';

@Module({
  imports: [
    SellerBrandModule,
    SellerProductTypeModule,
    SellerWarrantyModule,
    SellerVaraintModule,
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
    SequelizeModule.forFeature([
      Setting,
      GSBrand,
      GSGuarantee,
      GSProductType,
      GSVariant,
      GSGuaranteePeriod,
    ]),
  ],
  controllers: [SellerSyncController],
  providers: [
    SellerSyncService,
    SellerBrandProcessor,
    SellerProductTypeProcessor,
    SellerWarrantyProcessor,
    SellerVariantProcessor,
  ],
  exports: [SellerSyncService],
})
export class SellerSyncModule {}
