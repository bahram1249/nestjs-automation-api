import { Module } from '@nestjs/common';
import { BuffetModule } from './controller/admin/buffet/buffet.module';

@Module({
  imports: [BuffetModule],
})
export class DiscountCoffeModule {}
