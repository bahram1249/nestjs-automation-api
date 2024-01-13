import { Module } from '@nestjs/common';
import { ProductModule } from './admin/product/product.module';
import { LoginModule } from './user/login/login.module';

@Module({
  imports: [LoginModule, ProductModule],
})
export class ECommerceModule {}
