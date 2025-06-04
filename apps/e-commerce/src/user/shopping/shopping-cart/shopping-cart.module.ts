import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { AddressModule } from '../../address/address.module';
import { SessionModule } from '../../session/session.module';
import { DBLoggerModule } from '@rahino/logger';
import { ProductModule } from '@rahino/ecommerce/product/product.module';
import { QueryFilterModule } from '@rahino/query-filter';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECShoppingCart } from '@rahino/localdatabase/models';

@Module({
  imports: [
    LocalizationModule,
    AddressModule,
    SessionModule,
    DBLoggerModule,
    ProductModule,
    QueryFilterModule,
    SequelizeModule.forFeature([ECShoppingCart]),
  ],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
