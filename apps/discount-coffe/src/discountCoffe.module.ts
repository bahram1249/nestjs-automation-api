import { Module } from '@nestjs/common';
import { BuffetModule } from './controller/admin/buffet/buffet.module';
import { BuffetModule as BuffetApiModule } from './api/admin/buffet/buffet.module';
import { BuffetModule as UserBuffetModule } from './controller/buffet/buffet.module';
import { BuffetMenuCategoryApiModule } from './api/admin/menu-category/buffet-category.module';
import { MenuCategoryModule } from './controller/admin/menu-category/menu-category.module';
import { BuffetMenuApiModule } from './api/admin/menu/buffet-menu.module';
import { BuffetMenuModule } from './controller/admin/buffet-menu/buffet-menu.module';
import { LoginModule } from './controller/login/login.module';
@Module({
  imports: [
    BuffetModule,
    UserBuffetModule,
    BuffetApiModule,
    BuffetMenuCategoryApiModule,
    MenuCategoryModule,
    BuffetMenuApiModule,
    BuffetMenuModule,
    LoginModule,
  ],
})
export class DiscountCoffeModule {}
