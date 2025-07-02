import { Module } from '@nestjs/common';
import { TorobProductService } from './torob-product.service';
import { TorobProductController } from './torob-product.controller';
import { ProductModule } from '../../client/product/product.module';
import { QueryFilterModule } from '@rahino/query-filter';
import { TorobProductFormatterService } from './torob-product-formatter.service';

@Module({
  imports: [ProductModule, QueryFilterModule],
  controllers: [TorobProductController],
  providers: [TorobProductService, TorobProductFormatterService],
})
export class TorobProductModule {}
