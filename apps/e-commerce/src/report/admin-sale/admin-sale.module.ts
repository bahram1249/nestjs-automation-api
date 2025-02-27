import { Module } from '@nestjs/common';
import { AdminSaleService } from './admin-sale.service';
import { AdminSaleController } from './admin-sale.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ECOrderDetail } from '@rahino/localdatabase/models';
import { PersianDate } from '@rahino/database';
import { SaleQueryBuilderModule } from '../sale-query-builder/sale-query-builder.module';

@Module({
  imports: [
    SaleQueryBuilderModule,
    SequelizeModule.forFeature([User, Permission, ECOrderDetail, PersianDate]),
  ],
  controllers: [AdminSaleController],
  providers: [AdminSaleService],
})
export class AdminSaleModule {}
