import { Module } from '@nestjs/common';
import { ProductCommentService } from './product-comment.service';
import { ProductCommentController } from './product-comment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProductComment } from '@rahino/database/models/ecommerce-eav/ec-product-comment.entity';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { ECProductCommentFactor } from '@rahino/database/models/ecommerce-eav/ec-product-comment-factor.entity';
import { ECEntityTypeFactor } from '@rahino/database/models/ecommerce-eav/ec-entitytype-factor.entity';
import { SessionModule } from '../user/session/session.module';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([
      ECProductComment,
      EAVEntityType,
      ECProduct,
      ECProductCommentFactor,
      ECEntityTypeFactor,
    ]),
    SessionModule,
  ],
  controllers: [ProductCommentController],
  providers: [ProductCommentService],
})
export class ProductCommentModule {}
