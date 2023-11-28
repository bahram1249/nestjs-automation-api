import { Module } from '@nestjs/common';
import { ProductModule } from './admin/product/product.module';

@Module({
  imports: [ProductModule],
})
export class ECommerceModule {}
