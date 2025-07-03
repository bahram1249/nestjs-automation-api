import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PRODUCT_DISCOUNT_QUEUE } from './constansts';
import { ProductDiscountService } from './product-discount.service';
import { QueryFilterModule } from '@rahino/query-filter';
import { ProductModule } from '../../client/product/product.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/localdatabase/models';
import { ECInventory } from '@rahino/localdatabase/models';
import { ECDiscount } from '@rahino/localdatabase/models';
import { ProductDiscountSetterService } from './product-discount-setter.service';
import { ProductDiscountJobRunnerService } from './product-discount-job-runner.service';
import { ProductDiscountProcessor } from './product-discount.processor';
import { DBLoggerModule } from '@rahino/logger';
import { ApplyDiscountModule } from '../../shared/apply-discount';

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
    ApplyDiscountModule,
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
