import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SelectedProductController } from './selected-product.controller';
import { SelectedProductService } from './selected-product.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECSelectedProduct } from '@rahino/database/models/ecommerce-eav/ec-selected-product.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECSelectedProduct])],
  controllers: [SelectedProductController],
  providers: [SelectedProductService],
})
export class UserSelectedProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
