import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { ApplyDiscountService, ProductQueryBuilderService } from './service';
import { RedisClientModule } from '@rahino/redis-client';
import { ECDiscount } from '@rahino/database/models/ecommerce-eav/ec-discount.entity';

@Module({
  imports: [
    RedisClientModule,
    SequelizeModule.forFeature([ECProduct, ECDiscount]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductQueryBuilderService, ApplyDiscountService],
})
export class ProductModule {}
