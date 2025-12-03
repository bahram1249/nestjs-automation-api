import { Module, Scope } from '@nestjs/common';
import { ProductViewController } from './product-view.controller';
import { ProductViewService } from './product-view.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProductView } from '@rahino/localdatabase/models/ecommerce-eav/ec-product-view.model';
import { User } from '@rahino/database';
import { ProductModule } from '../product/product.module';
import { SessionModule } from '@rahino/ecommerce/user/session/session.module';

@Module({
  imports: [
    SequelizeModule.forFeature([ECProductView, User]),
    ProductModule,
    SessionModule,
  ],
  controllers: [ProductViewController],
  providers: [
    {
      scope: Scope.REQUEST,
      provide: ProductViewService,
      useClass: ProductViewService,
    },
  ],
})
export class ProductViewModule {}
