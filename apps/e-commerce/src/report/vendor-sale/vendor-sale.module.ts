import { Module } from '@nestjs/common';
import { VendorSaleService } from './vendor-sale.service';
import { VendorSaleController } from './vendor-sale.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ECOrderDetail } from '@rahino/localdatabase/models';
import { PersianDate } from '@rahino/database';
import { SaleQueryBuilderModule } from '../sale-query-builder/sale-query-builder.module';
import { UserVendorModule } from '@rahino/ecommerce/user/user-vendor/user-vendor.module';

@Module({
  imports: [
    SaleQueryBuilderModule,
    SequelizeModule.forFeature([User, Permission, ECOrderDetail, PersianDate]),
    UserVendorModule,
  ],
  controllers: [VendorSaleController],
  providers: [VendorSaleService],
})
export class VendorSaleModule {}
