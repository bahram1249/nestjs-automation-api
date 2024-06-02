import { Module } from '@nestjs/common';
import { AdminSaleService } from './admin-sale.service';
import { AdminSaleController } from './admin-sale.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { PersianDate } from '@rahino/database/models/core/view/persiandate.entity';
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
