import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ExtendOptionMiddleware } from '@rahino/commonmiddleware/middlewares/extend-option.middleware';
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

@Module({
  imports: [
    BuffetModule,
    MenuCategoryModule,
    BuffetMenuModule,
    TotalReserveModule,
    ReserveModule,
    AdminReportModule,
    CoffeReportModule,
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
      );
  }
}