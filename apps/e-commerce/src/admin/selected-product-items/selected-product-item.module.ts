import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SelectedProductItemController } from './selected-product-item.controller';
import { SelectedProductItemService } from './selected-product-item.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { SelectedProductItemProfile } from './mapper';
import { ECSelectedProduct } from '@rahino/database/models/ecommerce-eav/ec-selected-product.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { ECSelectedProductItem } from '@rahino/database/models/ecommerce-eav/ec-selected-product-item.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      ECSelectedProduct,
      ECProduct,
      ECSelectedProductItem,
    ]),
  ],
  controllers: [SelectedProductItemController],
  providers: [SelectedProductItemService, SelectedProductItemProfile],
})
export class SelectedProductItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
