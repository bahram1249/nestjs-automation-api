import { Module } from '@nestjs/common';
import { ProductFeedService } from './product-feed.service';
import { ProductFeedController } from './product-feed.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  ECProduct,
  ECVendor,
  ECProductView,
} from '@rahino/localdatabase/models';
import { RedisClientModule } from '@rahino/redis-client';
import { ECDiscount } from '@rahino/localdatabase/models';
import { ECInventoryStatus } from '@rahino/localdatabase/models';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { ECSlugVersion } from '@rahino/localdatabase/models';
import { QueryFilterModule } from '@rahino/query-filter';
import { DBLoggerModule } from '@rahino/logger';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { ApplyDiscountModule } from '../../shared/apply-discount';
import {
  ApplyInventoryStatus,
  ProductQueryBuilderService,
  RemoveEmptyPriceService,
} from '../product/service';
import { ProductRepositoryService } from '../product/service/product-repository.service';
import { ProductFeedFormatterService } from './product-feed-formatter.service';

@Module({
  imports: [
    RedisClientModule,

    SequelizeModule.forFeature([
      ECProduct,
      ECDiscount,
      ECInventoryStatus,
      EAVEntityType,
      ECSlugVersion,
      ECVendor,
      ECProductView,
    ]),
    SequelizeModule,
    QueryFilterModule,
    DBLoggerModule,
    LocalizationModule,
    ApplyDiscountModule,
    QueryFilterModule,
  ],
  controllers: [ProductFeedController],
  providers: [
    ProductFeedService,
    ProductQueryBuilderService,
    ApplyInventoryStatus,
    RemoveEmptyPriceService,
    ProductRepositoryService,
    ProductFeedFormatterService,
  ],
  exports: [ProductRepositoryService, ProductQueryBuilderService],
})
export class ProductFeedModule {}
