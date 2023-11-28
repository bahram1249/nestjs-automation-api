import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';

@Module({
  imports: [SequelizeModule.forFeature([ECProduct, User, Permission])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
