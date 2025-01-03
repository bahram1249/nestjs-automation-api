import { Module } from '@nestjs/common';
import { ProductCommentService } from './product-comment.service';
import { ProductCommentController } from './product-comment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProductComment } from '@rahino/database';
import { EAVEntityType } from '@rahino/database';
import { ECProduct } from '@rahino/database';
import { ECProductCommentFactor } from '@rahino/database';
import { ECEntityTypeFactor } from '@rahino/database';
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
