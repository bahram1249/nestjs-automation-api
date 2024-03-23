import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { ApplyDiscountService, ProductQueryBuilderService } from './service';
import { RedisClientModule } from '@rahino/redis-client';
import { ECDiscount } from '@rahino/database/models/ecommerce-eav/ec-discount.entity';
import { SessionModule } from '../user/session/session.module';
import { ProductRepositoryService } from './service/product-repository.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QUERY_NEXT_PAGE_PRODUCT_QUEUE } from './constants';
import { QueryNextPageProductProcessor } from './processor';

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
    SequelizeModule.forFeature([ECProduct, ECDiscount]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductQueryBuilderService,
    ApplyDiscountService,
    ProductRepositoryService,
    QueryNextPageProductProcessor,
  ],
})
export class ProductModule {}
