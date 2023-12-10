import { Module } from '@nestjs/common';
import { BuffetModule } from './api/admin/buffet/buffet.module';

@Module({
  imports: [BuffetModule],
})
export class DiscountCoffeModule {}
