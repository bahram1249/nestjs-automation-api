import { Module } from '@nestjs/common';
import { BuffetModule } from './controller/admin/buffet/buffet.module';
import { BuffetModule as BuffetApiModule } from './api/admin/buffet/buffet.module';
import { BuffetModule as UserBuffetModule } from './controller/buffet/buffet.module';
import { BuffetCategoryModule as BuffetCategoryApiModule } from './api/admin/menu-category/buffet-category.module';
import { MenuCategoryModule } from './controller/admin/menu-category/menu-category.module';
@Module({
  imports: [
    BuffetModule,
    UserBuffetModule,
    BuffetApiModule,
    BuffetCategoryApiModule,
    MenuCategoryModule,
  ],
})
export class DiscountCoffeModule {}
