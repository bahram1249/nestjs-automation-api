import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ExtendOptionMiddleware } from '@rahino/commonmiddleware';
import { BuffetModule } from './buffet/buffet.module';
import { MenuCategoryModule } from './menu-category/menu-category.module';
import { BuffetMenuModule } from './buffet-menu/buffet-menu.module';
import { TotalReserveModule } from './total-reserve/total-reserve.module';
import { ReserveModule } from './reservers/reserve.module';
import { AdminReportModule } from './adminreport/admin-report.module';
import { CoffeReportModule } from './coffereport/coffe-report.module';
import { BuffetController } from './buffet/buffet.controller';
import { MenuCategoryController } from './menu-category/menu-category.controller';
import { BuffetMenuController } from './buffet-menu/buffet-menu.controller';
import { TotalReserveController } from './total-reserve/total-reserve.controller';
import { ReserveController } from './reservers/reserve.controller';
import { AdminReportController } from './adminreport/admin-report.controller';
import { CoffeReportController } from './coffereport/coffe-report.controller';
import { QrScanModule } from './qrscan/qrscan.module';
import { QrScanController } from './qrscan/qrscan.controller';
import { HolidayModule } from './holiday/holiday.module';
import { HolidayController } from './holiday/holiday.controller';
import { FactorReportModule } from './factor-report/factor-report.module';
import { FactorReportController } from './factor-report/factor-report.controller';
import { AllFactorReportModule } from './all-factor-report/all-factor-report.module';
import { AllFactorReportController } from './all-factor-report/all-factor-report.controller';

@Module({
  imports: [
    BuffetModule,
    MenuCategoryModule,
    BuffetMenuModule,
    TotalReserveModule,
    ReserveModule,
    AdminReportModule,
    CoffeReportModule,
    QrScanModule,
    HolidayModule,
    FactorReportModule,
    AllFactorReportModule,
  ],
})
export class AdminModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtendOptionMiddleware)
      .forRoutes(
        BuffetController,
        MenuCategoryController,
        BuffetMenuController,
        TotalReserveController,
        ReserveController,
        AdminReportController,
        CoffeReportController,
        QrScanController,
        HolidayController,
        FactorReportController,
        AllFactorReportController,
      );
  }
}
