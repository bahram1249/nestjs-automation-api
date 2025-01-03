import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PRODUCT_DISCOUNT_QUEUE } from './constansts';
import { ProductDiscountService } from './product-discount.service';
import { QueryFilterModule } from '@rahino/query-filter';
import { ProductModule } from '../product/product.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/database';
import { ECInventory } from '@rahino/database';
import { ECDiscount } from '@rahino/database';
import { ProductDiscountSetterService } from './product-discount-setter.service';
import { ProductDiscountJobRunnerService } from './product-discount-job-runner.service';
import { ProductDiscountProcessor } from './product-discount.processor';
import { DBLoggerModule } from '@rahino/logger';

@Module({
  imports: [
    SequelizeModule.forFeature([ECProduct, ECInventory, ECDiscount]),
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
    BullModule.registerQueue({
      name: PRODUCT_DISCOUNT_QUEUE,
    }),
    DBLoggerModule,
    QueryFilterModule,
    ProductModule,
  ],
  providers: [
    ProductDiscountService,
    ProductDiscountSetterService,
    ProductDiscountProcessor,
    ProductDiscountJobRunnerService,
  ],
})
export class ProductDiscountModule {}
