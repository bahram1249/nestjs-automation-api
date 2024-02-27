import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECProduct])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
