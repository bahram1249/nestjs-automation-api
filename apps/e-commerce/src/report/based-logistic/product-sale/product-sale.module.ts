import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission, PersianDate, User } from '@rahino/database';
import { ECLogisticOrderGroupedDetail } from '@rahino/localdatabase/models';
import { BasedProductSaleController } from './product-sale.controller';
import { BasedProductSaleService } from './product-sale.service';
import { LogisticSaleQueryBuilderModule } from '../sale-query-builder/logistic-sale-query-builder.module';

@Module({
  imports: [
    LogisticSaleQueryBuilderModule,
    SequelizeModule.forFeature([
      PersianDate,
      ECLogisticOrderGroupedDetail,
      User,
      Permission,
    ]),
  ],
  controllers: [BasedProductSaleController],
  providers: [BasedProductSaleService],
})
export class BasedProductSaleModule {}
