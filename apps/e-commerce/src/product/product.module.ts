import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import {
  ApplyDiscountService,
  ProductQueryBuilderService,
  RemoveEmptyPriceService,
} from './service';
import { RedisClientModule } from '@rahino/redis-client';
import { ECDiscount } from '@rahino/database/models/ecommerce-eav/ec-discount.entity';
import { SessionModule } from '../user/session/session.module';
import { ProductRepositoryService } from './service/product-repository.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QUERY_NEXT_PAGE_PRODUCT_QUEUE } from './constants';
import { QueryNextPageProductProcessor } from './processor';
import { ApplyInventoryStatus } from './service/apply-inventory-status.service';
import { ECInventoryStatus } from '@rahino/database/models/ecommerce-eav/ec-inventory-status.entity';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { ECSlugVersion } from '@rahino/database/models/ecommerce-eav/ec-slug-version.entity';

@Module({
  imports: [
    SessionModule,
    RedisClientModule,
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
      name: QUERY_NEXT_PAGE_PRODUCT_QUEUE,
    }),
    SequelizeModule.forFeature([
      ECProduct,
      ECDiscount,
      ECInventoryStatus,
      EAVEntityType,
      ECSlugVersion,
    ]),
    SequelizeModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductQueryBuilderService,
    ApplyDiscountService,
    ApplyInventoryStatus,
    RemoveEmptyPriceService,
    ProductRepositoryService,
    QueryNextPageProductProcessor,
  ],
  exports: [
    ProductRepositoryService,
    ApplyDiscountService,
    ProductQueryBuilderService,
  ],
})
export class ProductModule {}
