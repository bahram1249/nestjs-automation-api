import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BuffetModule as BuffetApiModule } from './api/admin/buffet/buffet.module';
import { BuffetModule as UserBuffetModule } from './controller/buffet/buffet.module';
import { BuffetMenuCategoryApiModule } from './api/admin/menu-category/buffet-category.module';
import { BuffetMenuApiModule } from './api/admin/menu/buffet-menu.module';
import { LoginModule } from './controller/login/login.module';
import { HomeModule } from './controller/home/home.module';
import { TotalReserveApiModule } from './api/admin/total-reserve/total-reserve.module';
import { ReserveApiModule } from './api/admin/reserve/reserve.module';
import { AdminReportApiModule } from './api/admin/adminreport/admin-report.module';
import { CoffeReportApiModule } from './api/admin/coffereport/coffe-report.module';
import { BuffetModule as BuffetUserModule } from './api/user/buffet/buffet.module';
import { UserModule } from './controller/user/user.module';
import { AdminModule } from './controller/admin/admin.module';
import { QrScanApiModule } from './api/admin/qrscan/qrscan.module';
import { HolidayApiModule } from './api/admin/holiday/holiday.module';
import { AllFactorReportApiModule } from './api/admin/all-factor-report/all-factor-report.module';

@Module({
  imports: [
    AdminModule,
    UserBuffetModule,
    BuffetApiModule,
    BuffetMenuCategoryApiModule,
    BuffetMenuApiModule,
    TotalReserveApiModule,
    ReserveApiModule,
    AdminReportApiModule,
    CoffeReportApiModule,
    QrScanApiModule,
    HolidayApiModule,
    BuffetUserModule,
    AllFactorReportApiModule,
    LoginModule,
    HomeModule,
    UserModule,
  ],
})
export class DiscountCoffeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
