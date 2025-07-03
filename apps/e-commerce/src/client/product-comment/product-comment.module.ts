import { Module } from '@nestjs/common';
import { ProductCommentService } from './product-comment.service';
import { ProductCommentController } from './product-comment.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECProductComment } from '@rahino/localdatabase/models';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { ECProduct } from '@rahino/localdatabase/models';
import { ECProductCommentFactor } from '@rahino/localdatabase/models';
import { ECEntityTypeFactor } from '@rahino/localdatabase/models';
import { SessionModule } from '../../user/session/session.module';

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
