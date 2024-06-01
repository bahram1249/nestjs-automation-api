import { Module } from '@nestjs/common';
import { VendorSaleService } from './vendor-sale.service';
import { VendorSaleController } from './vendor-sale.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { PersianDate } from '@rahino/database/models/core/view/persiandate.entity';
import { AdminSaleQueryBuilderModule } from '../admin-sale-query-builder/admin-sale-query-builder.module';
import { UserVendorModule } from '@rahino/ecommerce/user/vendor/user-vendor.module';

@Module({
  imports: [
    AdminSaleQueryBuilderModule,
    SequelizeModule.forFeature([User, Permission, ECOrderDetail, PersianDate]),
    UserVendorModule,
  ],
  controllers: [VendorSaleController],
  providers: [VendorSaleService],
})
export class VendorSaleModule {}
