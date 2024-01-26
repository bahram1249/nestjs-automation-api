import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BuffetModule } from './controller/admin/buffet/buffet.module';
import { BuffetModule as BuffetApiModule } from './api/admin/buffet/buffet.module';
import { BuffetModule as UserBuffetModule } from './controller/buffet/buffet.module';
import { BuffetMenuCategoryApiModule } from './api/admin/menu-category/buffet-category.module';
import { MenuCategoryModule } from './controller/admin/menu-category/menu-category.module';
import { BuffetMenuApiModule } from './api/admin/menu/buffet-menu.module';
import { BuffetMenuModule } from './controller/admin/buffet-menu/buffet-menu.module';
import { LoginModule } from './controller/login/login.module';
import { HomeModule } from './controller/home/home.module';
import { TotalReserveModule } from './controller/admin/total-reserve/total-reserve.module';
import { TotalReserveApiModule } from './api/admin/total-reserve/total-reserve.module';
import { ReserveApiModule } from './api/admin/reserve/reserve.module';
import { ReserveModule } from './controller/admin/reservers/reserve.module';
import { AdminReportModule } from './controller/admin/adminreport/admin-report.module';
import { AdminReportApiModule } from './api/admin/adminreport/admin-report.module';
import { CoffeReportModule } from './controller/admin/coffereport/coffe-report.module';
import { CoffeReportApiModule } from './api/admin/coffereport/coffe-report.module';
import { BuffetModule as BuffetUserModule } from './api/user/buffet/buffet.module';

@Module({
  imports: [
    BuffetModule,
    UserBuffetModule,
    BuffetApiModule,
    BuffetMenuCategoryApiModule,
    MenuCategoryModule,
    BuffetMenuApiModule,
    BuffetMenuModule,
    TotalReserveApiModule,
    TotalReserveModule,
    ReserveApiModule,
    ReserveModule,
    AdminReportModule,
    AdminReportApiModule,
    CoffeReportModule,
    CoffeReportApiModule,
    BuffetUserModule,
    LoginModule,
    HomeModule,
  ],
})
export class DiscountCoffeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
