import { Module } from '@nestjs/common';
import { ProductFavoriteController } from './product-favorite.controller';
import { ProductFavoriteService } from './product-favorite.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SessionModule } from '../session/session.module';
import { ProductModule } from '@rahino/ecommerce/product/product.module';
import { ECProductFavorite } from '@rahino/database/models/ecommerce-eav/ec-product-favorite';

@Module({
  imports: [
    SessionModule,
    ProductModule,
    SequelizeModule.forFeature([ECProductFavorite]),
  ],
  controllers: [ProductFavoriteController],
  providers: [ProductFavoriteService],
  exports: [ProductFavoriteService],
})
export class ProductFavoriteModule {}
