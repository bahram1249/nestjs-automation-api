import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SelectedProductItemController } from './selected-product-item.controller';
import { SelectedProductItemService } from './selected-product-item.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { SelectedProductItemProfile } from './mapper';
import { ECSelectedProduct } from '@rahino/localdatabase/models';
import { ECProduct } from '@rahino/localdatabase/models';
import { ECSelectedProductItem } from '@rahino/localdatabase/models';

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
