import { Module } from '@nestjs/common';
import { BuffetModule } from './controller/admin/buffet/buffet.module';
import { BuffetModule as BuffetApiModule } from './api/admin/buffet/buffet.module';

@Module({
  imports: [BuffetModule, BuffetApiModule],
})
export class DiscountCoffeModule {}
