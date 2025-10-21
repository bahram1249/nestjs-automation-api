import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission, PersianDate, User } from '@rahino/database';
import { ECLogisticOrderGroupedDetail } from '@rahino/localdatabase/models';
import { BasedVendorSaleController } from './vendor-sale.controller';
import { BasedVendorSaleService } from './vendor-sale.service';
import { LogisticSaleQueryBuilderModule } from '../sale-query-builder/logistic-sale-query-builder.module';
import { UserVendorModule } from '../../../user/user-vendor/user-vendor.module';

@Module({
  imports: [
    LogisticSaleQueryBuilderModule,
    UserVendorModule,
    SequelizeModule.forFeature([
      PersianDate,
      ECLogisticOrderGroupedDetail,
      User,
      Permission,
    ]),
  ],
  controllers: [BasedVendorSaleController],
  providers: [BasedVendorSaleService],
})
export class BasedVendorSaleReportModule {}
