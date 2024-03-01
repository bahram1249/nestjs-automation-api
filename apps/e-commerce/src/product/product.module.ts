import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { ProductQueryBuilderService } from './service';

@Module({
  imports: [SequelizeModule.forFeature([ECProduct])],
  controllers: [ProductController],
  providers: [ProductService, ProductQueryBuilderService],
})
export class ProductModule {}
