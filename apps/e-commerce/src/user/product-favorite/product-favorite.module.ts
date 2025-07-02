import { Module } from '@nestjs/common';
import { FavoriteController } from './product-favorite.controller';
import { ProductFavoriteService } from './product-favorite.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { SessionModule } from '../session/session.module';
import { ProductModule } from '@rahino/ecommerce/client/product/product.module';
import { ECProductFavorite } from '@rahino/localdatabase/models';
import { QueryFilterModule } from '@rahino/query-filter';

@Module({
  imports: [
    SessionModule,
    ProductModule,
    SequelizeModule.forFeature([ECProductFavorite]),
    QueryFilterModule,
  ],
  controllers: [FavoriteController],
  providers: [ProductFavoriteService],
  exports: [ProductFavoriteService],
})
export class ProductFavoriteModule {}
